import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { v4 as uuidv4 } from "uuid";
import StarIcon from "../../../assets/icons/star-icon.svg?react";
import HalfStarIcon from "../../../assets/icons/star-half-icon.svg?react";
import FullStarIcon from "../../../assets/icons/star-full-icon.svg?react";
import { getActivityById } from "../../../utils/apiHelper";
import { InfinitySpin } from "react-loader-spinner";
import { PeopleControl } from "../../base/PeopleDropdown/PeopleDropdown";
import MapGL from "../../base/MapGL/MapGL";
import { useBasket } from "../../../context/BasketContext";
import { PersonType, Activity, Plan, TicketCount, BasketActivity, EntityId } from "../../../types/common";
import "swiper/css";
import "swiper/css/pagination";
import "./ActivityModal.scss";
import { useLocation, useNavigate } from "react-router-dom";

interface ActivityModalProps {
  activityId?: EntityId;
  planInfo: Plan | undefined;
  onClose: () => void;
  showMap: boolean;
}

const ActivityModal: React.FC<ActivityModalProps> = ({
  activityId,
  planInfo,
  onClose,
  showMap,
}) => {
  const { basketState, addActivity, removeActivity, hasActivity } = useBasket();
  const navigate = useNavigate();

  const location = useLocation();
  const locationId = location.pathname.split("/")[2];

  const [activity, setActivity] = useState<Activity | null>(null);
  const [ticketCount, setTicketCount] = useState<TicketCount>({ [PersonType.ADULT]: 1 });
  const [ticketTotalPrice, setTicketTotalPrice] = useState<number>(0);
  const [labels, setLabels] = useState<PersonType[]>([]);
  const [ticketPrices, setTicketPrices] = useState<Record<PersonType, number>>({} as Record<PersonType, number>);
  const [inBasket, setInBasket] = useState<boolean>(false);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);

  function roundHalf(num: number): number {
    return Math.round(num * 2) / 2;
  }

  const renderStars = (rating: number | undefined, maxRating: number = 5): JSX.Element[] => {
    const stars: JSX.Element[] = [];
    const roundRating = roundHalf(parseFloat(rating?.toString() || "0"));
    for (let i = 0; i < maxRating; i++) {
      if (i < roundRating) {
        stars.push(
          <div key={i}>
            <FullStarIcon className="activity__star-icon activity__star-icon--full" />
          </div>
        );
      } else if (i + 0.5 === roundRating) {
        stars.push(
          <div key={i}>
            <HalfStarIcon className="activity__star-icon" />
          </div>
        );
      } else {
        stars.push(
          <div key={i}>
            <StarIcon className="activity__star-icon" />
          </div>
        );
      }
    }
    return stars;
  };

  const initialRender = (prices: Activity['prices']): void => {
    if (!prices || !planInfo) return;

    let tempLabels: PersonType[] = [];
    let tempPrices: Record<PersonType, number> = {} as Record<PersonType, number>;
    let count: TicketCount = {} as TicketCount;

    Object.values(PersonType).forEach(personType => {
      if (prices && prices[personType]) {
        tempLabels.push(personType);
        const priceObj = prices[personType];
        tempPrices[personType] = priceObj?.minPrice || 0;
        const tickets = planInfo.people.hasOwnProperty(personType)
          ? planInfo.people[personType] || 0
          : 0;
        count[personType] = tickets;
      }
    });

    setTicketPrices(tempPrices);
    setLabels(tempLabels);
    setTicketCount(count);
  };

  const calcPrice = (): void => {
    let sumPrice = 0;

    if (!activity?.prices) return;

    Object.values(PersonType).forEach(personType => {
      if (activity.prices && activity.prices[personType]) {
        const priceObj = activity.prices[personType];
        sumPrice += (priceObj?.minPrice || 0) * (ticketCount[personType] || 0);
      }
    });

    setTicketTotalPrice(sumPrice);
  };

  const activityRender = async (): Promise<void> => {
    if (!activityId) return;

    try {
      const response = await getActivityById(activityId);
      setActivity({ ...response, images: response.images?.slice(1, 5) || [] });

      if (!response?.prices) {
        setTicketCount({ [PersonType.ADULT]: 1 });
      } else {
        initialRender(response.prices);
      }
      checkBasket(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeTicket = (label: PersonType, val: number): void => {
    setTicketCount({
      ...ticketCount,
      [label]: (ticketCount[label] || 0) + val,
    });
  };

  const handleAddToBasket = (): void => {
    if (!activity) return;

    const existingActivity = basketState?.activities?.find(
      (item) => item.activityId === activity.activityId
    );

    const activityToAdd: BasketActivity = {
      ...activity,
      planId: basketState!.planId,
      ticketCount,
      ticketTotalPrice,
    };

    if (existingActivity) {
      // Remove the existing activity and add the updated one
      removeActivity(activity.activityId);
      addActivity(activityToAdd);
      setIsUpdated(true);

      setTimeout(() => {
        setIsUpdated(false);
      }, 5000);
      return;
    }

    addActivity(activityToAdd);
    onClose();
  };

  const handleRemoveFromBasket = (): void => {
    if (!activity) return;
    removeActivity(activity.activityId);
  };

  const checkBasket = (activity: Activity): void => {
    if (basketState) {
      setInBasket(hasActivity(activity.activityId));
      
      const existingActivity = basketState.activities.find(
        (item) => item.activityId === activity.activityId
      );
      if (existingActivity) {
        const basketActivity = existingActivity as Activity & { ticketCount?: TicketCount; ticketTotalPrice?: number };
        setTicketCount(basketActivity.ticketCount || { [PersonType.ADULT]: 1 });
        setTicketTotalPrice(Number(basketActivity.ticketTotalPrice) || 0);
      }
    }
  };

  const resolveImageSrc = (image: unknown): string | undefined => {
    if (!image) return undefined;
    if (typeof image === "string") return image;
    if (typeof image === "object" && "url" in image) {
      const value = (image as { url?: unknown }).url;
      return typeof value === "string" ? value : undefined;
    }
    return undefined;
  };

  const formatOpeningHours = (value: unknown): string | undefined => {
    if (!value) return undefined;
    if (typeof value === "string") return value;
    if (typeof value === "object") {
      const openingHours = value as { weekdayDescriptions?: string[]; rawText?: string };
      if (openingHours.weekdayDescriptions?.length) {
        return openingHours.weekdayDescriptions.join(" | ");
      }
      if (openingHours.rawText) return openingHours.rawText;
    }
    return undefined;
  };

  useEffect(() => {
    if (!activity) return;
    checkBasket(activity);
  }, [basketState]);

  useEffect(() => {
    activityRender();
  }, [activityId]);

  useEffect(() => {
    calcPrice();
  }, [ticketCount, activity?.prices]);

  if (!activity || !basketState) {
    return (
      <div className="loader-overlay">
        <InfinitySpin
          width="200"
          color="#1e6655"
        />
      </div>
    );
  }

  return (
    <>
      <article className="activity__header">
        <h2 className="activity__title">{activity.name}</h2>
        <a
          href={activity.externalUrl}
          className="activity__link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit Official Page
        </a>
      </article>

      <article className="activity__images">
        <Swiper slidesPerView={1} pagination={true} modules={[Pagination]}>
          {activity.images?.map((image: any, index: number) => {
            const imageSrc = resolveImageSrc(image);
            return (
              <SwiperSlide key={index}>
                {imageSrc && (
                  <img
                    src={imageSrc}
                    alt={`${activity.name} image`}
                    className="activity__image"
                  />
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      </article>

      <article className="activity__content">
        <h2 className="activity__subtitle">Overview</h2>
        <p>{activity.description}</p>
        <p className="activity__info">Reviews</p>
        <div className="activity__reviews">
          <div className="activity-card__stars">
            {renderStars(activity?.reviewsAverageRating)}
          </div>
          <p className="activity__reviews-count">
            {activity?.reviewsTotalCount}
          </p>
        </div>
        {activity.duration != null && (
          <p className="activity__info">
            <strong>Expected Duration:</strong> {activity.duration} hrs
          </p>
        )}
        {(() => {
          const openingHoursText = formatOpeningHours(activity.openingHours);
          if (!openingHoursText) return null;
          return (
            <p className="activity__info">
              <strong>Opening Hours:</strong> {openingHoursText}
            </p>
          );
        })()}
      </article>

      {activity?.latitude && activity?.longitude && showMap && (
        <div
          className="activity__map"
          onClick={() => {
            onClose();
            navigate(`/create-plan/${locationId}/map?activity=${activityId}`);
          }}
        >
          <MapGL
            initialLocation={[activity.longitude, activity.latitude]}
            isResetVisible={true}
            markersList={[{
              activityId: activity.activityId,
              latitude: activity.latitude,
              longitude: activity.longitude,
              category: activity.category
            }]}
            isMoveable={false}
          />
        </div>
      )}

      <div
        className={`activity__content${
          !activity?.prices ? " activity__content--hidden" : ""
        }`}
      >
        {activity?.prices && (
          <div className="activity__basket">
            <h3 className="activity__subtitle">Tickets</h3>
            <div className="activity__ticket-count">
              {labels.map((label) => (
                <PeopleControl
                  key={uuidv4()}
                  label={`${label} Tickets (£${ticketPrices[label]})`}
                  count={ticketCount[label] || 0}
                  onChange={(val) => handleChangeTicket(label, val)}
                  min={label === PersonType.ADULT ? 1 : 0}
                />
              ))}
            </div>
            <p className="activity__total-price">
              Total Price: £{ticketTotalPrice.toFixed(2)}
            </p>
          </div>
        )}
        {inBasket ? (
          <>
            {isUpdated && (
              <p className="activity__updated">
                Activity was updated successfully
              </p>
            )}
            <div className="activity__in-basket">
              <button
                className="activity__remove-btn"
                onClick={() => handleRemoveFromBasket()}
              >
                Remove
              </button>
              <button
                className="activity__add-btn"
                onClick={() => handleAddToBasket()}
              >
                Update Basket
              </button>
            </div>
          </>
        ) : (
          <button
            className="activity__add-btn"
            onClick={() => handleAddToBasket()}
          >
            Add to Trip
          </button>
        )}
      </div>
    </>
  );
};

export default ActivityModal;

import { useEffect, useState } from "react";
import { getAllAttractionsForLocation } from "../../../utils/apiHelper";
import { InfinitySpin } from "react-loader-spinner";
import { v4 as uuidv4 } from "uuid";
import Error from "../../../assets/icons/error-icon.svg?react";
import ActivityCard from "../../base/ActivityCard/ActivityCard";
import "./ListActivitiesSection.scss";

const ListActivitiesSection = ({
  locationId,
  basketState,
  setBasketState,
  setSelectedActivity,
}) => {
  let filters = {};
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    tags: [],
  });
  const [error, setError] = useState(false);
  const [activities, setActivities] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [ws, setWs] = useState(null);

  const getAllActivities = (websocket) => {
    setLoadingMore(true);
    const limit = activities ? activities.length + 10 : 10;
    const requestData = {
      action: "getAttractions",
      locationId,
      offset: activities?.length || 0,
      limit,
    };
    websocket.send(JSON.stringify(requestData)); // Send request
  };

  const handleReload = () => {
    if (ws) ws.close(); // Close existing WebSocket
    const newWebSocket = initializeWebSocket(); // Reinitialize WebSocket
    setWs(newWebSocket);
  };

  const initializeWebSocket = () => {
    const websocket = new WebSocket(
      import.meta.env.VITE_ENV_TYPE === "DEV"
        ? import.meta.env.VITE_HYGGO_API_URL_WS
        : import.meta.env.VITE_HYGGO_API_URL_WSS_PRODUCTION
    );

    websocket.onopen = () => {
      console.log("WebSocket connected");
      setWs(websocket);
      if (locationId) {
        getAllActivities(websocket);
      }
    };

    const tempActivities = activities || [];

    websocket.onmessage = (event) => {
      const response = JSON.parse(event.data);

      if (response.statusCode === 200) {
        if (activities) {
          setActivities([...activities, ...response.data]);
        } else {
          setActivities(response.data);
        }
        websocket.close();
        setLoadingMore(false);
        setError(false);
        setWs(null);
      } else if (response.statusCode === 202) {
        console.log("Closing WebSocket due to 202 response.");
        setLoadingMore(false);
        setError(false);
        websocket.close();
        setWs(null);
      } else if (!response.statusCode) {
        tempActivities.push(response);
        setActivities(tempActivities);
        setLoadingMore(false);
      } else if (response.statusCode === 404) {
        setError("No more activities found");
        setLoadingMore(false);
        setWs(null);
        websocket.close();
      } else {
        setError(true);
        setLoadingMore(false);
        setWs(null);
        websocket.close();
      }
    };

    websocket.onclose = () => {
      console.log("WebSocket closed");
    };

    websocket.onerror = (err) => {
      console.error("WebSocket error: ", err);
      setError(true);
    };

    return websocket;
  };

  const getAllCategories = async () => {
    try {
      const response = await getAllCategoriesForLocation(locationId);
      filters = { ...filters, categories: response };
      setError(false);
    } catch (error) {
      // setError(true);
    }
  };

  const getAllFilters = async () => {
    try {
      getAllCategories();
    } catch (error) {
      setError(true);
    }
  };

  const getActivitiesByFilter = async () => {
    try {
      console.log("Filters:", selectedFilters);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getActivitiesByFilter();
  }, [selectedFilters]);

  useEffect(() => {
    if (!locationId) return;

    const websocket = initializeWebSocket();
    setWs(websocket);
    // getAllActivities();
    filters = getAllFilters() || {};
    return () => {
      if (ws) ws.close();
    };
  }, [locationId]);

  if (!activities || !basketState) {
    return (
      <div className="loader-overlay">
        <InfinitySpin
          visible={true}
          width="200"
          color="#ffffff"
          ariaLabel="infinity-spin-loading"
        />
      </div>
    );
  }

  return (
    <>
      <div className="list-activities">
        <h1 className="list-activities__title">Activities</h1>
        <div className="list-activities__filters"></div>
        <div className="list-activities__list">
          {activities.map((activity) => {
            return (
              <ActivityCard
                key={activity.activity_id ? activity.activity_id : uuidv4()}
                activity={activity}
                openActivity={() => setSelectedActivity(activity)}
                basketState={basketState}
                setBasketState={setBasketState}
              />
            );
          })}
        </div>
        {!loadingMore ? (
          error ? null : (
            <button
              className="list-activities__load-more-btn"
              onClick={handleReload}
            >
              Load more
            </button>
          )
        ) : (
          <InfinitySpin
            visible={true}
            width="200"
            color="#ffffff"
            ariaLabel="infinity-spin-loading"
          />
        )}
      </div>

      {error && (
        <p className="main__error">
          <Error />{" "}
          {typeof error === "string" ? error : "Failed Loading Activities"}
        </p>
      )}
    </>
  );
};

export default ListActivitiesSection;

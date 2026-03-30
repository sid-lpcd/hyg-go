import React from "react";
import CardSmall from "../../base/CardSmall/CardSmall";
import "./InspirationSection.scss";
import { PublicPlan } from "../../../types/common";

const InspirationSection: React.FC = () => {
  //To get top trips based on likes and recent trips eventually
  const inspirations: PublicPlan[] = [
    {
      planId: "1",
      userId: "1",
      title: "Tropical Paradise in Bora Bora",
      description: "A wonderful tropical vacation",
      locationId: "1",
      startDate: new Date("2024-06-15"),
      endDate: new Date("2024-06-22"),
      people: { adult: 2 },
      isPublic: true,
      likes: 246,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
      location: "Bora Bora, French Polynesia",
      imageUrl:
        "https://eatsleepbreathetravel.com/wp-content/uploads/2021/10/Bora_Bora_-12-2_50-2.jpg",
      user: {
        name: "Emily Stone",
        profileImage:
          "https://eatsleepbreathetravel.com/wp-content/uploads/2019/06/29th-of-May-2019-Hannah-54.jpg",
      },
    },
    {
      planId: "2",
      userId: "2",
      title: "Cultural Escape in Kyoto",
      description: "Exploring Japanese culture",
      locationId: "2",
      startDate: new Date("2024-07-10"),
      endDate: new Date("2024-07-17"),
      people: { adult: 1 },
      isPublic: true,
      likes: 180,
      createdAt: new Date("2024-02-01"),
      updatedAt: new Date("2024-02-01"),
      location: "Kyoto, Japan",
      imageUrl:
        "https://images.pexels.com/photos/3557603/pexels-photo-3557603.jpeg",
      user: {
        name: "Akira Matsuda",
        profileImage:
          "https://media.licdn.com/dms/image/v2/D5603AQG7ccl9cVncMw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1716105604544?e=2147483647&v=beta&t=Q3U4WDqdCT699TtGyUktRxVCEiVlgsmhAVMzHuuWX1A",
      },
    },
    {
      planId: "3",
      userId: "3",
      title: "Desert Adventure in Dubai",
      description: "Desert safari and city exploration",
      locationId: "3",
      startDate: new Date("2024-08-05"),
      endDate: new Date("2024-08-12"),
      people: { adult: 2, child: 1 },
      isPublic: true,
      likes: 312,
      createdAt: new Date("2024-03-01"),
      updatedAt: new Date("2024-03-01"),
      location: "Dubai, UAE",
      imageUrl:
        "https://images.pexels.com/photos/2563106/pexels-photo-2563106.jpeg",
      user: {
        name: "Omar Khaled",
        profileImage:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
      },
    },
    {
      planId: "4",
      userId: "4",
      title: "Beach Bliss in the Maldives",
      description: "Ultimate relaxation by the ocean",
      locationId: "4",
      startDate: new Date("2024-09-01"),
      endDate: new Date("2024-09-08"),
      people: { adult: 2 },
      isPublic: true,
      likes: 374,
      createdAt: new Date("2024-04-01"),
      updatedAt: new Date("2024-04-01"),
      location: "Maldives",
      imageUrl:
        "https://www.outrigger.com/globalassets/outrigger/images/resorts--hotels/maldives/outrigger-maldives-maafushivaru-resort/walkway-to-villas/outrigger-maldives-maafushivaru-resort-walkway-to-villas1.jpg",
      user: {
        name: "Isla Grace",
        profileImage:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0HBfWts24vpEMUcotpkjeTh35AHERi2QIYg&s",
      },
    },
  ];

  return (
    <section className="inspiration-section">
      <div>
        <h3 className="inspiration-section__title">Need Inspiration? </h3>
        <h4 className="inspiration-section__subtitle">
          Browse What Others Have Done
        </h4>
      </div>
      <div className="inspiration-cards">
        {inspirations.map((inspo) => (
          <CardSmall key={inspo.planId} plan={inspo} />
        ))}
      </div>
    </section>
  );
};

export default InspirationSection;

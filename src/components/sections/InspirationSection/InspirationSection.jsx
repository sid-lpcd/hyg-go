import CardSmall from "../../base/CardSmall/CardSmall";
import "./InspirationSection.scss";

const InspirationSection = () => {
  //To get top trips based on likes and recent trips eventually
  const inspirations = [
    {
      id: 1,
      title: "Tropical Paradise in Bora Bora",
      location: "Bora Bora, French Polynesia",
      likes: 246,
      image_url:
        "https://eatsleepbreathetravel.com/wp-content/uploads/2021/10/Bora_Bora_-12-2_50-2.jpg",
      user: {
        name: "Emily Stone",
        profile_image:
          "https://eatsleepbreathetravel.com/wp-content/uploads/2019/06/29th-of-May-2019-Hannah-54.jpg",
      },
    },
    {
      id: 2,
      title: "Cultural Escape in Kyoto",
      location: "Kyoto, Japan",
      likes: 180,
      image_url:
        "https://images.pexels.com/photos/3557603/pexels-photo-3557603.jpeg",
      user: {
        name: "Akira Matsuda",
        profile_image:
          "https://media.licdn.com/dms/image/v2/D5603AQG7ccl9cVncMw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1716105604544?e=2147483647&v=beta&t=Q3U4WDqdCT699TtGyUktRxVCEiVlgsmhAVMzHuuWX1A",
      },
    },
    {
      id: 3,
      title: "Desert Adventure in Dubai",
      location: "Dubai, UAE",
      likes: 312,
      image_url:
        "https://images.pexels.com/photos/2563106/pexels-photo-2563106.jpeg",
      user: {
        name: "Omar Khaled",
        profile_image:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
      },
    },
    {
      id: 4,
      title: "Beach Bliss in the Maldives",
      location: "Maldives",
      likes: 374,
      image_url:
        "https://www.outrigger.com/globalassets/outrigger/images/resorts--hotels/maldives/outrigger-maldives-maafushivaru-resort/walkway-to-villas/outrigger-maldives-maafushivaru-resort-walkway-to-villas1.jpg",
      user: {
        name: "Isla Grace",
        profile_image:
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
          <CardSmall key={inspo.id} plan={inspo} />
        ))}
      </div>
    </section>
  );
};

export default InspirationSection;

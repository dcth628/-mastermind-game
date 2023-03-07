import React, { useEffect, useRef, useState } from "react";
// import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useParams, useHistory } from "react-router-dom";
import { getSpotDetail } from "../../store/spot";
import EditSpotForm from "../SpotEdit";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import * as spotActions from '../../store/spot';
import AllReviews from "../ReviewBySpotId";
import CreateReviewFrom from "../ReviewCreate";
import ConfirmDeleteSpotModal from "../ComfirmDeleteSpotModal";

const SpotDetails = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { spotId } = useParams();
  const spots = useSelector(state => state?.spot[spotId]);
  // console.log(spots.ownerId, 'this is the spot object')
  const sessionUser = useSelector(state => state?.session.user);
  // console.log(sessionUser.id, "this is the session User" )

  useEffect(() => {
    dispatch(getSpotDetail(spotId))
  }, [dispatch, spotId]);

  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  return (
    <div>
      {spots && (
        <div>
          <h1>Spot Details</h1>
          <ul key={spots.id}>
            <h2>{spots.name}</h2>
            <p>{spots.city}, {spots.state}, {spots.country}</p>
            <img src={spots.previewImage} alt={spots.previewImage} />
            <p>{spots.description}</p>
            <p>${spots.price} night</p>
            {spots.avgRating &&
              spots.avgRating ?
              <p> Rating: {spots.avgRating} </p> :
              <p>NEW!</p>
            }
            {spots.numReviews &&
              spots.numReviews ?
              <p> {spots.numReviews} Reviews</p> :
              <p> Leave a review?</p>
            }
            {spots.Owner && <p>Hosted by {spots.Owner.firstName} {spots.Owner.lastName}</p>}
            { spots && spots.ownerId === sessionUser.id ?
            <button>
              <OpenModalMenuItem
                itemText="Edit Spot"
                onItemClick={closeMenu}
                modalComponent={<EditSpotForm spot={spots} />}
              />
            </button>
            :
            <></>
            }
            <button>
              <OpenModalMenuItem
                itemText="Post YOur Review"
                onItemClick={closeMenu}
                modalComponent={<CreateReviewFrom spotId={spotId} />}
              />
            </button>
          </ul>
          <div>
            <AllReviews spots={spots} />
          </div>
        </div>
      )}
    </div>
  )
};

export default SpotDetails;

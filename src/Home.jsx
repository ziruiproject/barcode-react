import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { auth } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { firestore } from "./firebase";

export default function Home() {
  const [userData, setUserData] = useState(null);
  const [userUid, setUserUid] = useState(null);
  const [area, setArea] = useState(null);
  const [regu, setRegu] = useState(null);

  const userQuery = useMemo(() => {
    return query(collection(firestore, "users"), where("uid", "==", userUid));
  }, [userUid]);

  const fetchUserData = useCallback(async () => {
    try {
      const userSnapshot = await getDocs(userQuery);
      if (userSnapshot.size === 1) {
        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();
        setUserData(userData);

        // Fetch regu data
        const reguSnapshot = await getDocs(
          query(
            collection(firestore, "regu"),
            where("id", "==", String(userData.reguId))
          )
        );
        if (reguSnapshot.size === 1) {
          const reguDoc = reguSnapshot.docs[0];
          setRegu(reguDoc.data());
        } else {
          console.warn("Regu document not found for id:", userData.reguId);
        }

        // Fetch area data
        const areaSnapshot = await getDocs(
          query(
            collection(firestore, "area"),
            where("id", "==", String(userData.areaId))
          )
        );
        if (areaSnapshot.size === 1) {
          const areaDoc = areaSnapshot.docs[0];
          setArea(areaDoc.data());
        } else {
          console.warn("Area document not found for id:", userData.areaId);
        }
      } else {
        console.warn("User document not found for uid:", userUid);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [userQuery, userUid]);

  const Logout = () => {
    auth.signOut().catch((error) => {
      console.error("Error signing out:", error.message);
    });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        window.location.replace("/login");
      } else {
        setUserUid(user.uid);
        console.log("halo");
        await fetchUserData(user.uid);
      }
    });

    return () => unsubscribe;
  }, [fetchUserData]);

  return (
    <ul className=" flex flex-col items-center justify-center min-h-screen">
      <img src="/logo.png" className="h-[256px]" alt="" />
      {userData && area && regu && (
        <div className="flex flex-col pt-5 gap-y-4 text-center">
          <div className="flex flex-col">
            <span>Nama</span>
            <span className="font-semibold text-2xl">
              {userData?.displayName}
            </span>
          </div>
          <div className="flex flex-col">
            <span>Area</span>
            <span className="font-semibold text-2xl">{area.name}</span>
          </div>
          <div className="flex flex-col">
            <span>Regu</span>
            <span className="font-semibold text-2xl">{regu.name}</span>
          </div>
        </div>
      )}
      <Link to="/scan">
        <li className="hover:bg-blue-700 flex items-center justify-center w-64 h-12 px-6 mt-8 text-sm font-semibold text-blue-100 bg-blue-600 rounded">
          Scan di Lokasi
        </li>
      </Link>
      <Link to="/history/scan">
        <li className="hover:bg-blue-700 flex items-center justify-center w-64 h-12 px-6 mt-8 text-sm font-semibold text-blue-100 bg-blue-600 rounded">
          Scan History
        </li>
      </Link>
      {/* <Link to="/lapor">
                <li className="hover:bg-blue-700 flex items-center justify-center w-64 h-12 px-6 mt-8 text-sm font-semibold text-blue-100 bg-blue-600 rounded">
                    Lapor Kejadian
                </li>
            </Link>
            <Link to="/history/kejadian">
                <li className="hover:bg-blue-700 flex items-center justify-center w-64 h-12 px-6 mt-8 text-sm font-semibold text-blue-100 bg-blue-600 rounded">
                    History Kejadian
                </li>
            </Link> */}
      <Link to="/login">
        <button
          onClick={Logout}
          className="hover:bg-red-700 flex items-center justify-center w-64 h-12 px-6 mt-8 text-sm font-semibold text-blue-100 bg-red-600 rounded"
        >
          Logout
        </button>
      </Link>
    </ul>
  );
}

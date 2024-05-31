import { useState, useEffect, useCallback, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  collection,
  query,
  where,
  getDocs,
  limit,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { firestore } from "./firebase";
import { auth } from "./firebase";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

export default function ScanHistory() {
  const [selectedDate, setSelectedDate] = useState(
    new Date(new Date().setHours(0, 0, 0, 0)).getTime()
  );
  const [selectedOption, setSelectedOption] = useState("self");
  const [selectedRegu, setSelectedRegu] = useState("semua");
  const [selectedArea, setSelectedArea] = useState("semua");
  const [userUid, setUserUid] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [userData, setUserData] = useState(null);
  const [reguOptions, setReguOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [endDate, setEndDate] = useState(
    new Date(new Date().setHours(23, 59, 59, 999)).getTime()
  );
  const [dateError, setDateError] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(new Date(date.setHours(0, 0, 0, 0)).getTime());
  };

  const handleEndDateChange = (date) => {
    const newEndDate = new Date(date.setHours(23, 59, 59, 999)).getTime();
    setEndDate(newEndDate);
    if (newEndDate < selectedDate) {
      setDateError("Tanggal akhir harus sesudah tanggal awal!");
    } else {
      setDateError(null);
    }
  };

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleReguChange = (event) => {
    console.log(event.target.value);
    setSelectedRegu(event.target.value);
  };

  const handleAreaChange = (event) => {
    setSelectedArea(event.target.value);
  };

  const downloadExcelQuery = useCallback(() => {
    if (!userData) return null;

    let q = query(
      collection(firestore, "histories"),
      where("timestamp", ">=", selectedDate / 1000),
      where("timestamp", "<=", endDate / 1000),
      orderBy("timestamp", "desc")
    );

    if (selectedOption === "self") {
      q = query(
        q,
        where("userData.uid", "in", [userData.uid, String(userData.uid)])
      );
    } else if (selectedOption === "regu") {
      q = query(
        q,
        where("userData.reguId", "in", [
          userData.reguId,
          String(userData.reguId),
        ])
      );
    } else if (selectedOption === "area") {
      q = query(
        q,
        where("userData.areaId", "in", [
          userData.areaId,
          String(userData.areaId),
        ])
      );
    }

    if (selectedArea !== "semua") {
      q = query(
        q,
        where("userData.areaId", "in", [selectedArea, Number(selectedArea)])
      );
    }

    if (selectedRegu !== "semua") {
      q = query(
        q,
        where("userData.reguId", "in", [selectedRegu, Number(selectedRegu)])
      );
    }

    return q;
  }, [
    userData,
    selectedDate,
    endDate,
    selectedOption,
    selectedArea,
    selectedRegu,
  ]);

  const handleDownloadExcel = async () => {
    try {
      // Fetch history data for downloading Excel without limit
      const q = downloadExcelQuery();
      if (!q) return;

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => doc.data());

      console.log(data);

      // Generate Excel file with fetched data
      const worksheet = XLSX.utils.json_to_sheet(
        data.map((dataItem) => ({
          nama: dataItem.userData.displayName,
          barcode: dataItem.scanned,
          area: areaOptions.find((area) => area.id == dataItem.userData.areaId)
            ?.name,
          regu: reguOptions.find((regu) => regu.id == dataItem.userData.reguId)
            ?.name,
          latitude: dataItem.coordinates?.latitude,
          longitude: dataItem.coordinates?.longitude,
          waktu: new Date(dataItem.timestamp * 1000).toLocaleDateString(
            "id-ID",
            {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }
          ),
        }))
      );

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "HistoryData");

      const currentDate = new Date();
      const yy = String(currentDate.getFullYear()).slice(-2);
      const mm = String(currentDate.getMonth() + 1).padStart(2, "0");
      const dd = String(currentDate.getDate()).padStart(2, "0");
      const hh = String(currentDate.getHours()).padStart(2, "0");
      const mi = String(currentDate.getMinutes()).padStart(2, "0");
      const ss = String(currentDate.getSeconds()).padStart(2, "0");
      const fileName = `HistoryData_${yy}${mm}${dd}${hh}${mi}${ss}.xlsx`;

      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error("Error generating Excel file:", error);
    }
  };

  const userQuery = useMemo(() => {
    return query(collection(firestore, "users"), where("uid", "==", userUid));
  }, [userUid]);

  const reguQuery = useMemo(() => {
    return query(collection(firestore, "regu"));
  }, []);

  const areaQuery = useMemo(() => {
    return query(collection(firestore, "area"));
  }, []);

  const historyQuery = useCallback(() => {
    if (!userData) return null;

    let q = query(
      collection(firestore, "histories"),
      where("timestamp", ">=", selectedDate / 1000),
      where("timestamp", "<=", endDate / 1000),
      orderBy("timestamp", "desc"),
      limit(5)
    );

    if (selectedOption === "self") {
      q = query(
        q,
        where("userData.uid", "in", [userData.uid, String(userData.uid)])
      );
    } else if (selectedOption === "regu") {
      q = query(
        q,
        where("userData.reguId", "in", [
          userData.reguId,
          String(userData.reguId),
        ])
      );
    } else if (selectedOption === "area") {
      q = query(
        q,
        where("userData.areaId", "in", [
          userData.areaId,
          String(userData.areaId),
        ])
      );
    }

    if (selectedArea !== "semua") {
      q = query(
        q,
        where("userData.areaId", "in", [selectedArea, Number(selectedArea)])
      );
    }

    if (selectedRegu !== "semua") {
      q = query(
        q,
        where("userData.reguId", "in", [selectedRegu, Number(selectedRegu)])
      );
    }

    return q;
  }, [
    userData,
    selectedDate,
    endDate,
    selectedOption,
    selectedArea,
    selectedRegu,
  ]);

  const fetchHistoryData = useCallback(async () => {
    const q = historyQuery();
    if (!q) return;

    try {
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => doc.data());

      setHistoryData(data);

      console.log("History data fetched:", data);
    } catch (error) {
      console.error(error);
    }
  }, [historyQuery]);

  const fetchUserData = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(userQuery);
      if (querySnapshot.size === 1) {
        const userDoc = querySnapshot.docs[0];
        setUserData(userDoc.data());
      } else {
        console.warn("User document not found:", userUid);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [userQuery, userUid]);

  const fetchRegu = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(reguQuery);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReguOptions(data);
    } catch (error) {
      console.error(error);
    }
  }, [reguQuery]);

  const fetchArea = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(areaQuery);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAreaOptions(data);
    } catch (error) {
      console.error(error);
    }
  }, [areaQuery]);

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

    fetchRegu();
    fetchArea();

    return () => unsubscribe();
  }, [fetchUserData, fetchRegu, fetchArea]);

  useEffect(() => {
    if (userData) {
      fetchHistoryData();
    }
  }, [
    userData,
    selectedDate,
    endDate,
    selectedOption,
    selectedArea,
    selectedRegu,
    fetchHistoryData,
  ]);

  return (
    <div className="gap-y-5 grid max-w-2xl p-4 mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Scan History</h1>
        <div className="flex gap-x-2">
          <Link to="/">
            <button className="hover:bg-blue-700 px-4 py-2 text-white transition-all duration-300 ease-in-out bg-blue-500 rounded-md">
              Menu Utama
            </button>
          </Link>
          <Link to="/scan">
            <button className="hover:bg-blue-700 px-4 py-2 text-white transition-all duration-300 ease-in-out bg-blue-500 rounded-md">
              Scan
            </button>
          </Link>
        </div>
      </div>
      <div className="gap-y-5 flex flex-col">
        <div className="gap-y-1 grid">
          <label className="">Pilih Tanggal Awal:</label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            className="p-2 border rounded-md"
            dateFormat="dd/MM/yyyy"
          />
        </div>
        <div className="gap-y-1 grid">
          <label className="">Pilih Tanggal Akhir:</label>
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            className="p-2 border rounded-md"
            dateFormat="dd/MM/yyyy"
          />
        </div>
        {dateError && <p className="text-red-500">{dateError}</p>}
        {userData && userData.roleId >= 2 && (
          <div className="gap-y-1 grid">
            <label>Tampilkan Untuk</label>
            <select
              className="block w-full p-2 bg-white border rounded-md"
              value={selectedOption}
              onChange={handleSelectChange}
            >
              <option value="self">Diri Sendiri</option>
              <option value="regu">Satu Regu</option>
              {userData.roleId > 2 && <option value="area">Satu Area</option>}
              {userData.roleId == 99 && (
                <option value="admin">Superadmin</option>
              )}
            </select>
          </div>
        )}
        {userData &&
          (userData.roleId == 99 || userData.roleId == 3) &&
          (selectedOption === "admin" || selectedOption === "area") && (
            <>
              <div className="gap-y-1 grid">
                <label>Cari Berdasarkan Regu</label>
                <select
                  className="block w-full p-2 bg-white border rounded-md"
                  value={selectedRegu}
                  onChange={handleReguChange}
                >
                  <option key="semua" value="semua">
                    Semua
                  </option>
                  {reguOptions.map((regu) => (
                    <option key={regu.id} value={regu.id}>
                      {regu.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="gap-y-1 grid">
                <label>Cari Berdasarkan Area</label>
                <select
                  className="block w-full p-2 bg-white border rounded-md"
                  value={selectedArea}
                  onChange={handleAreaChange}
                >
                  <option key="semua" value="semua">
                    Semua
                  </option>
                  {areaOptions.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="py-3 font-medium text-white bg-blue-500 rounded-lg"
                onClick={handleDownloadExcel}
              >
                Download Excel
              </button>
            </>
          )}
      </div>
      <div className="gap-y-5 grid">
        {historyData.length === 0 ? (
          <p className="text-red-500">Data tidak ada</p>
        ) : (
          historyData.map((historyItem, index) => (
            <div key={index} className=" rounded-xl gap-y-5 grid p-4 shadow-md">
              <div className=" gap-x-2 flex">
                <span className="w-fit px-3 py-1 text-sm text-blue-500 bg-blue-100 rounded-full">
                  {
                    areaOptions.find(
                      (area) => area.id == historyItem.userData.areaId
                    )?.name
                  }
                </span>
                <span className="w-fit px-3 py-1 text-sm text-blue-500 bg-blue-100 rounded-full">
                  {
                    reguOptions.find(
                      (regu) => regu.id == historyItem.userData.reguId
                    )?.name
                  }
                </span>
              </div>
              <span className="mr-auto text-xl font-medium">
                {historyItem.userData.displayName}
              </span>
              <span className="text-xl">{historyItem.scanned}</span>
              <div className="flex  flex-col gap-y-3 justify-between">
                <span className="w-fit px-3 py-1 text-sm text-blue-500 bg-blue-100 rounded-full">
                  {new Date(historyItem.timestamp * 1000).toLocaleDateString(
                    "id-ID",
                    {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    }
                  )}{" "}
                  WIB
                </span>
                <span className="w-fit gap-x-1 flex px-3 py-1 text-sm text-blue-500 bg-blue-100 rounded-full">
                  <span className="">
                    {historyItem.coordinates?.latitude
                      ? historyItem.coordinates?.latitude
                      : "NaN"}
                  </span>
                  ,
                  <span className="">
                    {historyItem.coordinates?.longitude
                      ? historyItem.coordinates?.longitude
                      : "NaN"}
                  </span>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

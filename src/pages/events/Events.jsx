import React, { useEffect, useState } from "react";
import "./Events.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import Modal from "../../components/small_component/Modal";
import Sidebar from "../../components/sidebar/Sidebar";

export default function Events() {
  const [eventsInfo, setEventsInfo] = useState([]);
  const [showAddModal, setshowAddModal] = useState(false);
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [selectedEventModal, setSelectedEventModal] = useState({});
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleCardClick = (data) => {
    setShowOpenModal(true);
    setSelectedEventModal(data);
  };

  const AddEvent = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    console.log(
      form.get("name"),
      form.get("organisor"),
      form.get("DateOfOrganisation"),
      form.get("guestList")
    );
  };
  const data = [
    { name: "John Doe", age: 28, email: "john@example.com" },
    { name: "Jane Smith", age: 34, email: "jane@example.com" },
    { name: "Sam Green", age: 22, email: "sam@example.com" },
  ];

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Age", accessor: "age" },
    { header: "Email", accessor: "email" },
  ];
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
    // fetch events
    setEventsInfo([
      {
        name: "Event 1",
        organisor: "hitesh",
        dateOfOrganisation: new Date().toLocaleDateString(),
        guestList: [
          { name: "pawan", mobile: "525125525" },
          { name: "hitesh", mobile: "26951256" },
        ],
        createdAt: new Date().toLocaleDateString(),
        active: true,
      },
      {
        name: "Event 1",
        organisor: "hitesh",
        dateOfOrganisation: new Date().toLocaleDateString(),
        guestList: [
          { name: "pawan", mobile: "525125525" },
          { name: "hitesh", mobile: "26951256" },
        ],
        createdAt: new Date().toLocaleDateString(),
        active: true,
      },
      {
        name: "Event 1",
        organisor: "hitesh",
        dateOfOrganisation: new Date().toLocaleDateString(),
        guestList: [
          { name: "pawan", mobile: "525125525" },
          { name: "hitesh", mobile: "26951256" },
        ],
        createdAt: new Date().toLocaleDateString(),
        active: true,
      },
    ]);
  }, []);
  return (
    <div className="eventCont">
      {/* <Sidebar /> */}
      <div className="card cardAdd" onClick={() => setshowAddModal(true)}>
        <FontAwesomeIcon icon={faSquarePlus} />
      </div>
      {eventsInfo?.map((val) => (
        <div className="card" onClick={() => handleCardClick(val)}>
          <div
            className="cardEdit"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </div>
          <div>
            <span> Event Name: </span>
            <span className="darkBold"> {val.name} </span>
          </div>
          <div>
            <span> Organisor Name: </span>
            <span className="darkBold"> {val.organisor} </span>
          </div>
          <div>
            <span>Date of Organisation : </span>
            <span className="darkBold"> {val.dateOfOrganisation} </span>
          </div>
          <div>
            <span>No. of Guest: </span>
            <span className="darkBold"> {val.guestList.length} </span>
          </div>
          <div>
            <span>Created At: </span>
            <span className="darkBold"> {val.createdAt} </span>
          </div>
        </div>
      ))}
      {showAddModal && (
        <Modal
          show={showAddModal}
          handleClose={() => setshowAddModal(false)}
          modalHeading={"Add Event"}
        >
          <form onSubmit={AddEvent}>
            <div className="modalField">
              <label htmlFor="name">Event Name:</label>
              <input type="text" id="name" name="name" />
            </div>
            <div className="modalField">
              <label htmlFor="organisor">Organisor:</label>
              <input type="organisor" id="organisor" name="organisor" />
            </div>
            <div className="modalField">
              <label htmlFor="DateOfOrganisation">Date of Organization:</label>
              <input
                type="date"
                id="DateOfOrganisation"
                name="DateOfOrganisation"
              />
            </div>
            <div className="button">
              <label htmlFor="guestList">Upload Guest List</label>
              <input type="file" id="guestList" name="guestList" />
            </div>
            <div className="button">
              <button type="submit">Submit</button>
            </div>
          </form>
        </Modal>
      )}
      {showOpenModal && (
        <Modal
          show={showOpenModal}
          handleClose={() => setShowOpenModal(false)}
          modalHeading={selectedEventModal.name}
        >
          <form>
            <div className="modalField">
              <label htmlFor="organisor">Organisor:</label>
              <input
                type="organisor"
                id="organisor"
                name="organisor"
                value={selectedEventModal.organisor}
              />
            </div>
            <div className="modalField">
              <label htmlFor="DateOfOrganisation">Date of Organization:</label>
              <input
                type="date"
                id="DateOfOrganisation"
                name="DateOfOrganisation"
                value={new Date(selectedEventModal.dateOfOrganisation)
                  ?.toISOString()
                  ?.substring(0, 10)}
              />
            </div>
            <div className="modalField">
              <label htmlFor="DateOfOrganisation">Guest List</label>
              {/* <span>jh</span> */}
            </div>
            <table className="table">
              <thead>
                <tr>
                  {Object.keys(selectedEventModal.guestList[0]).map(
                    (column, index) => (
                      <th key={index}>{column}</th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {selectedEventModal.guestList.map((row, i) => (
                  <tr key={i}>
                    {console.log(row)}
                    {Object.values(row).map((col, j) => (
                      <td key={j}> {col} </td>
                    ))}
                  </tr>
                ))}
                {/* {data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map((column, colIndex) => (
                      <td key={colIndex}>{row[column.accessor]}</td>
                    ))}
                  </tr>
                ))} */}
              </tbody>
            </table>

          </form>
        </Modal>
      )}
    </div>
  );
}

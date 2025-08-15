import { useState,useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {

  const[users, setUsers] = useState([]);
  const[filteredUsers, setFilteredUsers] = useState([]);
  const[isModalOpen, setModalOpen] = useState();
  const[userDetails, setuserDetails] = useState({name:"", age:"", city:"", contact:""});

  const getAllUsers = async () => {
    await axios.get("https://student-crud-nest.vercel.app/student/").then(
      (res) => {
        console.log(res.data);
        setUsers(res.data);
        setFilteredUsers(res.data);
      }
    );
  };

  useEffect(()=> {
    getAllUsers();
  }, []);

  // -------------------------------  Handle SEARCH  ------------------------------------ //

  const handleSearchChange = (e) =>{
    console.log(e.target.value);
    const searchText = e.target.value.toLowerCase();
    const filterUser = users.filter((user) => 
      user.name.toLowerCase().includes(searchText) || user.city.toLowerCase().includes(searchText));

    console.log(filterUser);
    setFilteredUsers(filterUser);
  };

  // -------------------------------  Handle DELETE  ------------------------------------ //

  const handleDelete = async (userId) => {
    const isConfirmed = window.confirm("Are you sure want to delete the user?");

    if(isConfirmed)
    {
      await axios.delete(`https://student-crud-nest.vercel.app/student/${userId}`).then
      ((res) => {
          console.log(res.data);
          const deletedUser = res.data;
          setUsers(prevUser => prevUser.filter((user) => user._id !== deletedUser._id));
          setFilteredUsers(prevUser => prevUser.filter((user) => user._id !== deletedUser._id));
        }
      );
    }
  };

  const openModal = () => {
    setuserDetails({name:"", age:null, city:"", contact:null});
    setModalOpen(true);
  };

  const closeModal = () => {
    getAllUsers();
    setModalOpen(false);
  };


  // -------------------------------  Add User Details (POST)  ------------------------------------ //

  const handleData = (e) => {
    setuserDetails({...userDetails, [e.target.name]: e.target.value});
  };

  const handleSumbit = async (e) => {
    e.preventDefault();

    if(userDetails._id)
    {
      await axios.put(`https://student-crud-nest.vercel.app/student/${userDetails._id}`, userDetails).then(
        (res) => {
          console.log(res.data);
          setuserDetails({name:"", age:"", city:"", contact:""});
        } 
      );
    }
    else{
      await axios.post("https://student-crud-nest.vercel.app/student/", userDetails).then(
        (res) => {
          console.log(res.data);
          setuserDetails({name:"", age:"", city:"", contact:""});
        } 
      );
    }
    
  };

  const handleUpdate = (user) => {
    setModalOpen(true);
    setuserDetails(user);
  };

  return (
    // <>

      <div className="container">
        <h3>CRUD OPERATION USING EMPLOYEE DETAIL</h3>
        <div className="input-search">
          <input type="search" placeholder='Search text here...' onChange={handleSearchChange} />
          <button className='btn green' onClick={openModal}>Add Student</button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Contact</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers && filteredUsers.map((user, index) => {
              return (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.age}</td>
                  <td>{user.city}</td>
                  <td>{user.contact}</td>
                  <td><button className='btn green' onClick={() => handleUpdate(user)}>Edit</button></td>
                  <td><button className='btn red' onClick={() => handleDelete(user._id)}>Delete</button></td>
                </tr>
              );
            })}
            
          </tbody>  
        </table>

        {isModalOpen && (
          <div className='modal'>
            <div className='modal-container'>
              <span className='close' onClick={closeModal}>&times;</span>
              <h2>User Details</h2>

              <div className="input-group">
                <label htmlFor="name">Name:</label>
                <input type="text" name='name' id='name' onChange={handleData} value={userDetails.name} required/>
              </div>
              <div className="input-group">
                <label htmlFor="age">Age:</label>
                <input type="number" name='age' id='age' onChange={handleData} value={userDetails.age} required/>
              </div>
              <div className="input-group">
                <label htmlFor="city">City:</label>
                <input type="text" name='city' id='city' onChange={handleData} value={userDetails.city} required/>
              </div>
              <div className="input-group">
                <label htmlFor="contact">Contact:</label>
                <input type="tel" name='contact' id='contact' pattern='[6-9]{1}[0-9]{9}' maxLength={10} onChange={handleData} value={userDetails.contact} required/>
              </div>
              <button className='btn green' onClick={handleSumbit}> Add user</button>
            </div>
          </div>
        )}
        
      </div>
    // </>
  )
}

export default App;

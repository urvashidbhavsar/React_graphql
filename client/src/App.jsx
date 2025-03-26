import React, { useState } from 'react'
import './App.css'
import { useQuery, useMutation, gql } from "@apollo/client"

const GET_USERS = gql`
  query Getuserss{
  getUsers {
      id
      age
      name
      isMarried
  }
}`;

const GET_USER_BY_ID = gql`
  query GetUserById($id:ID!){
  getUserById(id:$id) {
      id
      age
      name
      isMarried
  }
}`;

const CREATE_USER = gql`
  mutation CreateUser($name:String!, $age:Int!, $isMarried:Boolean!){
  createUser(name:$name, age:$age, isMarried:$isMarried) {
      name
  }
}`;

const App = () => {
  const [newuser, setNewuser] = useState({
    name: "",
    age: ""
  })
  const handlechange = (e) => {
    setNewuser({ ...newuser, [e.target.name]: e.target.value })
  }

  const { data: getUserData, error: getUserError, loading: getLoading } = useQuery(GET_USERS)
  const { data: getId, error: getErr, loading: getLoad } = useQuery(GET_USER_BY_ID, {
    variables: { id: 2 },
  })

  const [createUser] = useMutation(CREATE_USER)

  if (getLoading) return <p>Data loading ... </p>
  if (getUserError) return <p>{getUserError.message}</p>

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(newuser)
    // createUser({
    //   variables:
    //     { name: newuser.name, age: Number(newuser.age), isMarried: false }
    // })
    createUser({
      variables: { name: newuser.name, age: Number(newuser.age), isMarried: false },
      refetchQueries: [{ query: GET_USERS }]
    });
  }

  return (
    <>
      <div>
        <input type="text" placeholder='Name...' name='name' onChange={handlechange} value={newuser.name} />
        <input type="number" placeholder='Age...' name='age' onChange={handlechange} value={newuser.age} />
        {/* <input type="text" placeholder='Name...' /> */}
        <button onClick={handleSubmit}>Create User</button>
      </div>


      <h3>Select User</h3>
      <div>
        {
          getLoad ?
            <p>Loading...</p>
            :
            <p>{getId.getUserById.name}</p>
        }
      </div>
      <h1>Users</h1>
      <div>
        {
          getUserData.getUsers.map(items =>
            <div key={items.name}>
              <p>Name : {items.name}</p>
              <p>Age : {items.age}</p>
              <p>Is Married? : {items.isMarried ? "Yes" : "No"}</p>
            </div>
          )
        }
      </div>
    </>
  )
}

export default App

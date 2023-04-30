import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { TodoMap } from "../components";
import { todoStore } from "../store/todoSlice";
import { UserData } from "../store/userSlice";
import { useTodoFetch } from "../hook/use-TodoFetch";
import axios from "axios";

const Home = () => {
  const [title, setTitle] = useState("");
  const { Todo } = useSelector((state) => state.userTodo);
  const user = localStorage.getItem("userId");
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const { todoData } = useTodoFetch(
    `http://localhost:8080/api/todo/${user}`,
    options
  );

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/users/${user}`)
      .then((res) => {
        dispatch(UserData({ user: res.data.user }));
      })
      .catch((err) => console.log(err));
    if (!!todoData?.data?.data) {
      dispatch(
        todoStore({
          Todo: todoData?.data?.data?.Todo,
        })
      );
    }
  }, [todoData?.data?.data.Todo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        `http://localhost:8080/api/todo/${user}`,
        { title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        todoData.refetch();
        setTitle("");
      });
  };
  return (
    <div className="mt-20">
      <div className="w-[100vh] flex justify-center items-center text-5xl font-semibold mb-10">
        TodoList
      </div>
      <div className="flex flex-col justify-center items-center ">
        <div className="flex">
          <input
            name="title"
            value={title}
            className="bg-white p-2 rounded w-[50vh] border-blue-400 focus:ring-2 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onChange={({ target }) => {
              setTitle(target.value);
            }}
          />
          <button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-e-lg text-sm px-6 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={handleSubmit}
          >
            Add
          </button>
        </div>
        <div className="flex flex-col mt-10 gap-4 w-[55vh]">
          {Todo?.map((todo) => (
            <TodoMap
              key={`${todo._id}`}
              {...todo}
              refetch={todoData.refetch}
              options={options}
            />
          ))}
        </div>
        {todoData.isLoading && <div>Loading</div>}
        {Todo?.length === 0 && <div>No Data</div>}
      </div>
    </div>
  );
};

export default Home;

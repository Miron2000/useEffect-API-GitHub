import React, {useEffect, useState} from "react";
import axios from "axios";
import {SearchResult, SearchUserType} from "../type/type";

type UsersListPropsType = {
  term: string;
  selectedUser: SearchUserType | null;
  onUserSelect: (user: SearchUserType) => void;
}
export const UserList = (props: UsersListPropsType) => {
  const [users, setUsers] = useState<SearchUserType[]>([]);

  useEffect(() => {
    console.log('SYNC USERS');
    axios.get<SearchResult>(`https://api.github.com/search/users?q=${props.term}`)
        .then(res => {
          setUsers(res.data.items);
        })
  }, [props.term]);

  return (
      <ul>
        {users.map(u => <li key={u.id}
                            className={props.selectedUser === u ? 'selected' : ''}
                            onClick={() => {
                              props.onUserSelect(u);
                            }}>
          {u.login}
        </li>)}
      </ul>
  )
}
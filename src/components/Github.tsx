import React, {useEffect, useState} from 'react';
import './github.css';
import {UserList} from "./UserList/UserList";
import {Search} from "./SearchInput/Search";
import {SearchUserType} from "./type/type";
import {UserDetails} from "./UserDetails/UserDetails";

export const Github = () => {
  const initialSearchState = 'Miron2000';
  const [selectedUser, setSelectedUser] = useState<SearchUserType | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchState);

  useEffect(() => {
    console.log('SYNC TITLE');
    if (selectedUser) {
      document.title = selectedUser.login;
    }
  }, [selectedUser]);


  return (
      <div className="container">
        <div>
          <Search value={searchTerm} onSubmit={(value:string) => setSearchTerm(value)}/>
          <button onClick={() => setSearchTerm(initialSearchState)}>Reset</button>
          <UserList term={searchTerm} selectedUser={selectedUser} onUserSelect={setSelectedUser}/>
        </div>
        <UserDetails user={selectedUser}/>
      </div>
  )
}

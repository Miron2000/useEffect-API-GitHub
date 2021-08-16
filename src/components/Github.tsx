import React, {useEffect, useState} from 'react';
import './github.css';
import axios from "axios";

type SearchUserType = {
  login: string;
  id: number;
};
type SearchResult = {
  items: SearchUserType[];
};
type UserType = {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  followers: number;
}

type SearchPropsType = {
  value: string;
  onSubmit: (fixedValue: string) => void;
}
export const Search = (props: SearchPropsType) => {
  const [tempSearch, setTempSearch] = useState<string>('');

  useEffect(() => {
    setTempSearch(props.value);
  }, [props.value])

  return (
      <div>
        <input placeholder="search"
               value={tempSearch}
               onChange={(e) => {
                 setTempSearch(e.currentTarget.value)
               }}/>

        <button onClick={() => {
          props.onSubmit(tempSearch)
        }}>find</button>
      </div>
  )
}

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

type TimerProps = {
  seconds: number;
  onChange: (actualSeconds: number) => void;
  timerKey: string;
}
export const Timer = (props: TimerProps) => {
  const [seconds, setSeconds] = useState<number>(props.seconds);

  useEffect(() => {
    setSeconds(props.seconds);
  }, [props.seconds]);

  useEffect(() => {
    props.onChange(seconds);
  }, [seconds])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => {clearInterval(intervalId)};
  }, [props.timerKey]);

  return (
      <div>
        {seconds}
      </div>
  )
}

type UserDetailsPropsType = {
  user: SearchUserType | null;
}
export const UserDetails = (props: UserDetailsPropsType) => {
  const [userDetails, setUserDetails] = useState<null | UserType>(null);
  const startTimerSeconds = 10;
  const [seconds, setSeconds] = useState<number>(startTimerSeconds);

  useEffect(() => {
    console.log('SYNC USERS DETAILS');
    if (!!props.user) {
      axios.get<UserType>(`https://api.github.com/users/${props.user.login}`)
          .then(res => {
            setSeconds(startTimerSeconds);
            setUserDetails(res.data);
          })
    }
  }, [props.user]);

  useEffect(() => {
    if(seconds < 1) {
      setUserDetails(null);
    }
  }, [seconds])

  return (
      <div>
        {userDetails && <div>
          <Timer seconds={seconds} onChange={setSeconds} timerKey={userDetails.id.toString()}/>
          <h2>Username: {userDetails.login}</h2>
          <img src={userDetails.avatar_url} alt={userDetails.avatar_url}/>
          <div>
            <a href={userDetails.html_url} target="_blank">Link</a>
          </div>
          <div> {userDetails.login}, followers: {userDetails.followers}</div>
        </div>}
      </div>
  )
}

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

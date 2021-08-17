import React, {useEffect, useState} from "react";
import axios from "axios";
import {Timer} from "../Timer/Timer";
import {SearchUserType} from "../type/type";

type UserType = {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  followers: number;
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
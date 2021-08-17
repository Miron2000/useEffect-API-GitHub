import React, {useEffect, useState} from "react";

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
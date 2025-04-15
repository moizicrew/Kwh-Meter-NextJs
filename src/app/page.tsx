import { auth } from "@/auth";
import DisplayData from "@/components/MQTTDisplayData2";
import DisplayDatas from "@/components/MQTTDisplayData3";
import React from "react";

const Home = async () => {
  const session = await auth();

  if (!session) {
    return <p>Not authenticated</p>;
  }

  return (
    <>{session.user.role === "admin" ? <DisplayData /> : <DisplayDatas />}</>
  );
};

export default Home;

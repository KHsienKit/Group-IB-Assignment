import React, {useEffect, useState, useRef} from "react";
import { useOutletContext } from "react-router-dom";
import {Notification, Settings} from "../types"
import NotificationPage from "./NotificationPage";

// Pages


const Main = () => {

    // Receiving context from parent
    const context = useOutletContext<{
        settings: Settings; setSettings: React.Dispatch<React.SetStateAction<Settings>>; 
        notification: Notification[]; setNotification: React.Dispatch<React.SetStateAction<Notification[]>>}>();

    // Declaring settings variables
    const settings = context.settings;
    const count = settings.count;
    const position = settings.position;
    const timeOut = settings.time
    
    // Declaring notification state  and setState variables
    const notificationArray = context.notification;
    const setNotification = context.setNotification;
    
    // Declaring function that reads from SettingsState to determine position of notifications
    const determinePosition = (position : string) => {
        switch (position) {
            case("1"):
                return "position-1 ";
            case("2"):
                return "position-2 ";
            case("3"):
                return "position-3 ";
            case("4"):
                return "position-4 ";
        }
    }

    return (
        <div id="main">
            <div className={determinePosition(position) + "notification-box"}>
                {notificationArray.filter(notification => notification.displayed).map((notification) => {
                    const notificationProps = {notification, setNotification, settings};
                    return <NotificationPage notification={notificationProps} key={notification.msg_id}/>})}
                {

                }
            </div>
        </div>
    );
};

export default Main;
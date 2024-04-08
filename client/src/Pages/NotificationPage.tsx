import React, {useEffect, useState, useRef} from "react";
import {Notification, Settings} from "../types"
import {filter} from "./NavBar"

const NotificationPage = (props : {notification : {notification: Notification; setNotification: React.Dispatch<React.SetStateAction<Notification[]>>; settings: Settings}}) => {
    
    // Declaring notification variables from props received from main
    const notificationObject = props.notification.notification;
    const msg_id = notificationObject.msg_id;
    const msg = notificationObject.msg;
    const time = notificationObject.time;
    const hover = notificationObject.hover;
    const setNotification = props.notification.setNotification;

    // Declaring settings variables from props received from main
    const count = props.notification.settings.count;
    const timeOut = props.notification.settings.time;
    const position = props.notification.settings.position;

    // Declaring timeOutFilter function to remove notifications that have timed out
    const timeOutFilter = () => {
        setNotification((prevState) => {
            prevState = filter(prevState, timeOut, count);
            return prevState;
        })
    }

    // Declaring notification closing function when X is pressed on notification
    const closeNotification = () => {
        const currentTime = Math.floor(Date.now() / 1000);
        setNotification((prevState) => {
            // When X is pressed on a notification, remove that notification from NotificationQueue
            prevState = prevState.filter(item => !(item == notificationObject))

            // When X is pressed, remove that notification from local storage
            window.localStorage.removeItem(`${msg_id}`)

            // Display the next notification in queue
            let displaySlice = prevState.slice(0, count);
            displaySlice = displaySlice.map((items) => {
                if (!items.displayed) {
                    items.displayed = true;
                    items.time = currentTime;
                }
                return items;
            })
            let notDisplaySlice = prevState.slice(count);
            prevState = displaySlice.concat(notDisplaySlice);
            return prevState
        })
    }

    //Declaring notification hover functions where notification timeout is reset
    const hoverNotification = () => {
        setNotification((prevState) => {
            // When mouse enters the notification box, set hover of that notification to true
            const index = prevState.indexOf(notificationObject);
            prevState[index].hover = true;
            return prevState;
        })
    }

    const timeOutReset = () => {
        const currentTime = Math.floor(Date.now()/1000);
        setNotification((prevState) => {
            // When mouse leaves the notification box, set time of that notification to current time and set hover to false
            const index = prevState.indexOf(notificationObject);
            prevState[index].time = currentTime;
            prevState[index].hover = false;

            // Create a timeout to remove the notification that have timed out from display
            setTimeout(timeOutFilter, timeOut * 1000);
            return prevState;
        })
    }

    // Declaring truncate function for when oldest message is to be truncated when not all messages can be displayed full on page
    const truncate = () => {
        const currentElement = document.getElementById(`${msg_id}`)?.getBoundingClientRect();
        const top = currentElement?.top;
        const bottom = currentElement?.bottom;
        const maxHeightDownwards = window.innerHeight;
        const maxHeightUpwards = 70; // This is the height of the navbar as measured when inspecting
        
        if (top != undefined && bottom != undefined) {
            // If position is in 1 or 2, truncate the oldest notification when the bottom of the newest notification is below the viewport
            if ((position == "1" || position == "2") && (bottom >= maxHeightDownwards)) {
                setNotification((prevState) => {
                    let index = 0;
                    while (prevState[index].hover) {
                        index += 1;
                    }
                    prevState = prevState.slice(0, index).concat(prevState.slice(index + 1));
                    return prevState;
                })
            }
            // If position is in 3 or 4, truncate the oldest notification when the top of the newest notification reaches the navbar
            else if ((position == "3" || position == "4") && (top <= maxHeightUpwards)) {
                setNotification((prevState) => {
                    let index = 0;
                    while (prevState[index].hover) {
                        index += 1;
                    }
                    prevState = prevState.slice(0, index).concat(prevState.slice(index + 1));
                    return prevState;
                })
            }
        }
    }

    useEffect(() => {
        truncate();
    })

    return <div className={"notification"} onMouseEnter={hoverNotification} onMouseLeave={timeOutReset} id={msg_id}>
    <p className="notification-text">{msg}</p>
    <p className="close-button" onClick={closeNotification}>X</p>
        </div>
}

export default NotificationPage;
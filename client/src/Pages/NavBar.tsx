import React, {useEffect, useState, useRef} from "react";
import ReactRouter, {NavLink, Outlet, useNavigate} from "react-router-dom";
import {Notification, Settings} from "../types"

// Declaring local storage variable
const localStorage = window.localStorage;
localStorage.clear();

// Making event source to receive data from server readyState
let evtSource = new EventSource("http://localhost:9000/events");

// Declaring broadcast channel
// const bc = new BroadcastChannel("server");
// bc.postMessage("new server");
// bc.onmessage = (event) => {
//     if (event.data == "new server") {
//         bc.postMessage(evtSource);
//     }
//     else {
//         evtSource = event.data;
//     }
// }
// console.log(evtSource);

// Declaring filter function to remove notifications that have timed out and to display the next notification in queue
export const filter = (notificationArray : Notification[], timeOut : number, count : number) => {

    const currentTime = Math.floor(Date.now() / 1000);

    // For local storage, remove notifications that were displayed and have timed out from local storage
    const removedNotificationArray = notificationArray.filter((items) => {
        return !((!items.displayed) || (currentTime - items.time < timeOut) || (items.hover));
    })
    for (let i = 0; i < removedNotificationArray.length; i += 1) {
        localStorage.removeItem(`${removedNotificationArray[i].msg_id}`)
    }

    // For notification queue, remove notifications that were displayed and have timed out from queue
    notificationArray = notificationArray.filter((items) => {
            return (!items.displayed) || (currentTime - items.time < timeOut) || (items.hover);
    })

    // For notification queue, set a fixed number of notifications to be displayed as defined in the settings
    let displaySlice = notificationArray.slice(0, count);
    displaySlice = displaySlice.map((items) => {
        if (!items.displayed) {
            items.displayed = true;
            items.time = currentTime;
        }
        return items;
    })
    let notDisplaySlice = notificationArray.slice(count);
    notificationArray = displaySlice.concat(notDisplaySlice);

    // For local storage, add displayed notifications to storage
    for(let i = 0; i < displaySlice.length; i += 1) {
        localStorage.setItem(`${displaySlice[i].msg_id}`, `${displaySlice[i].msg}`)
    }
    return notificationArray;
}

const NavBar = () => {
    // Declaring states
    const [SettingsState, SetSettingsState] = useState<Settings>({count: 5, position: "1", time: 5})
    const [NotificationQueue, SetNotificationQueue] = useState<Array<Notification>>([]);

    // Declaring context to be passed down to children
    const context = {settings: SettingsState, setSettings: SetSettingsState, notification: NotificationQueue, setNotification: SetNotificationQueue};
    
    // Declaring settings variables
    const count = SettingsState.count;
    const timeOut = SettingsState.time;

    // Declaring timeOutFilter function to remove notifications that have timed out
    const timeOutFilter = () => {
        SetNotificationQueue((prevState) => {
            prevState = filter(prevState, timeOut, count);
            return prevState;
        })
    }

    useEffect(() => {
        // Receive data from server and add to notification queue
        evtSource.onmessage = (event) => {
            let data  = JSON.parse(event.data);
            data.displayed = false;
            data.hover = false;

            SetNotificationQueue((prevState) => {
                // Add newest data to end of queue
                prevState.push(data);

                // Take out notifications that have timed out and display next notification in queue
                prevState = filter(prevState, timeOut, count);

                // Create a timeout to take out the notification(data) that have timed out
                setTimeout(timeOutFilter, timeOut * 1000);
                return prevState;
            })
        }
    })

    return (
        <div>
            <header>
                <nav>
                    <h1>Notification Task</h1>
                    <NavLink to="/" className={({isActive}) => {
                        return isActive ? "nav-link-active" : "nav-link"
                    }}>Main</NavLink>
                    <NavLink to="settings" className={({isActive}) => {
                        return isActive ? "nav-link-active" : "nav-link"
                    }}>Settings</NavLink>
                </nav>
            </header>
            <main>
                <Outlet context={context}/>
            </main>
        </div>
    );
};

export default NavBar;
import React, {useEffect, useState, useRef} from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import {Settings, Notification} from "../types"

const Settings = () => {
    // Declare context
    const context = useOutletContext<{
        settings: Settings; setSettings: React.Dispatch<React.SetStateAction<Settings>>; 
        notification: Notification[]; setNotification: React.Dispatch<React.SetStateAction<Notification[]>>;
        total: React.MutableRefObject<number>}>();
    const settings = context.settings;
    const setSettings = context.setSettings;
    
    // Functions
    // Handle notification count change
    const handleNotificationCount = (value: number) => {
        setSettings((prevState) => {
            return {...prevState, count: value};
        })
    }

    // Handle position change
    const handleRadioButton = (value: string) => {
        setSettings((prevState) => {
            return {...prevState, position: value};
        })
    }

    // Handle notification timeout change
    const handleNotificationTimeout = (value: number) => {
        setSettings((prevState) => {
            return {...prevState, time: value};
        })
    }
    
    return (
        <div id="settings">
            <div className="settings-box" id="notification-count-box">
                <h2 className="settings-text">Notification Count</h2>
                {/* <h2 className="settings-display">{settings.count}</h2> */}
                <label htmlFor="notification-count"></label>
                <input onChange={(e) => {handleNotificationCount(Number(e.target.value))}} type="number" id="notification-count" name="notification-count" min="0" placeholder={String(settings.count)}></input>
            </div>
            <div className="settings-box" id="notification-position-box">
                <h2 className="settings-text">Notification Position</h2>
                {/* <h2 className="settings-display">{settings.position}</h2> */}
                <label htmlFor="position-1" className="settings-radio-text">Position 1</label>
                <input type="radio" className="settings-radio" name="position" id="position-1" value="1" onClick={() => handleRadioButton("1")} onChange={e => {}} checked={settings.position == "1"}></input>
                <label htmlFor="position-2" className="settings-radio-text">Position 2</label>
                <input type="radio" className="settings-radio" name="position" id="position-2" value="2" onClick={() => handleRadioButton("2")} onChange={e => {}} checked={settings.position == "2"}></input>
                <label htmlFor="position-3" className="settings-radio-text">Position 3</label>
                <input type="radio" className="settings-radio" name="position" id="position-3" value="3" onClick={() => handleRadioButton("3")} onChange={e => {}} checked={settings.position == "3"}></input>
                <label htmlFor="position-4" className="settings-radio-text">Position 4</label>
                <input type="radio" className="settings-radio" name="position" id="position-4" value="4" onClick={() => handleRadioButton("4")} onChange={e => {}} checked={settings.position == "4"}></input>
            </div>
            <div className="settings-box" id="notification-time-box">
                <h2 className="settings-text" >Notification Disappear Time</h2>
                {/* <h2 className="settings-display">{settings.time}</h2> */}
                <label htmlFor="notification-timeout"></label>
                <input onChange={(e) => {handleNotificationTimeout(Number(e.target.value))}} type="number" id="notification-timeout" name="notification-timeout" min="0"  placeholder={String(settings.time)}></input>
                <h2 className="settings-display">sec</h2>
            </div>
        </div>
        
    );
};

export default Settings;
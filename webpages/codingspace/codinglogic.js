import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";
import {
    getDatabase,
    ref,
    set,
    child,
    update,
    remove,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { get } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { db } from "../CurrentProjects/currentProjects.js";
import { getCookie } from "../../common/getCookie.js";

document.addEventListener("DOMContentLoaded", () => {
    const username = getCookie("username");
    const userID = getCookie("userID");

    if (username) {
        console.log("Username from codinglogic.js:", username);
    } else {
        console.log("No username stored in the cookie");
    }

    const codeRef = ref(db, "code");
    const socket = io();
    const codingSpace = document.getElementById("codingSpace");
    const roomName = window.location.pathname.slice(1);
    let editorChangeInProgress = false;

    socket.emit("joinRoom", roomName);

    // Initialize ACE Editor
    const editor = ace.edit("editor");
    editor.setTheme("ace/theme/twilight");
    editor.getSession().setMode("ace/mode/javascript");

    const fetchAndDisplayInitialData = async () => {
        try {
            const dataSnapshot = await get(child(codeRef, roomName));
            if (dataSnapshot.exists()) {
                const initialCode = dataSnapshot.val();
                codingSpace.value = initialCode;
                editor.setValue(initialCode, 1);
            }
        } catch (error) {
            console.error("Error fetching initial data:", error);
        }
    };
    fetchAndDisplayInitialData();

    // Problem Starts Here
    const updateCode = (newCode) => {
        editorChangeInProgress = true;

        // Get the current cursor position
        const cursorPosition = editor.getCursorPosition();

        editor.setValue(newCode, -1);

        // Restore the cursor position
        editor.moveCursorToPosition(cursorPosition);

        editorChangeInProgress = false;
    };

    editor.getSession().on("change", (event) => {
        if (!editorChangeInProgress) {
            const newCode = editor.getValue();
            updateCode(newCode);
            socket.emit("codeChange", { roomName, newCode });
            update(codeRef, { [roomName]: newCode });
        }
    });

    socket.on("codeChange", (newCode) => {
        if (!editorChangeInProgress) {
            updateCode(newCode);
        }
    });
    // Problem Ends Here

    const runButton = document.getElementById("runButton");
    const outputDiv = document.getElementById("output");

    runButton.addEventListener("click", () => {
        const codeToRun = editor.getValue();

        try {
            // Use eval to evaluate the code
            eval(codeToRun);

            // Search for console.log statements in the code and extract their outputs
            const consoleOutput = captureConsoleOutput(codeToRun);

            // Display the result in the output div
            if (consoleOutput) {
                outputDiv.innerHTML = `Result:
                    ${consoleOutput.replace(/\n/g, "<br>")}`;
            } else {
                outputDiv.innerHTML = "";
            }
        } catch (error) {
            // Display errors in the output div
            outputDiv.innerHTML = `Error: ${error}`;
        }
    });

    // Function to capture console.log statements
    function captureConsoleOutput(code) {
        const consoleLogMessages = [];
        const originalConsoleLog = console.log;

        // Override console.log to capture messages
        console.log = function (...args) {
            consoleLogMessages.push(
                args.map((arg) => JSON.stringify(arg)).join(" ")
            );
        };

        // Execute the code
        try {
            eval(code);
        } catch (error) {
            // Handle errors in the code
            console.log(`Error: ${error}`);
        } finally {
            // Restore the original console.log
            console.log = originalConsoleLog;
        }
        // Return the captured console output
        return consoleLogMessages.join("\n");
    }
});

Copley Controls Corporation
Date: 5-30-2020   
Author: Anthony Redamonti

The following is an example webpage to load in a Copley Controls drive.
The drive must be an EtherCAT drive converted to TCP/IP mode.
- See this instructional video for how to convert: https://www.youtube.com/watch?v=H8Xfzh-wjlU&t=1s
- The official Copley Controls YouTube Page: https://www.youtube.com/channel/UClBL0o4iIcPVsbVwmz4LTfA 

Navigate to the "web.zip" file: SingleAxisWebpage-TeslaOdometerRMSThermometer\web\web.zip
Load the "web.zip" file into the drive using the Copley Default Landing Page.

About the example:

The GUI will display a Tesla Odometer which displays actual velocity, current, bus voltage, and 
temperature in real time.
The RMS current is displayed in a thermometer. If the RMS current exceeds 90% of the continuous 
current, the color of the thermometer will turn red indicating over-heating of the drive.
There is also a virtual motor shaft simulating the actual position of the motor in real time.

The user can change the commanded velocity using the velocity slidebar.
The v-loop limit can also be set using the v-loop textfield and button.

There is a button group where the user can clear the latched faults, jog in the positive
direction, jog in the negative direction, perform a trajectory sequence, home the motor, 
or abort the move. The Jog_Pos function on line 314 of the main.js file has commented code which
displays how to address other drives on the network using their IP address.

WARNING: DO NOT load the webpage on multiple browsers at once. Copley ethernet drives can only
communicate with one master (browser) at a time.

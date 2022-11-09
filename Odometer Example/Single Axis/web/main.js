/*

The following is an example webpage to load in a Copley Controls drive.
The drive must be an etherCAT drive converted to TCP/IP mode.
See this instructional video for how to convert: https://www.youtube.com/watch?v=H8Xfzh-wjlU&t=1s
The official Copley Controls YouTube Page: https://www.youtube.com/channel/UClBL0o4iIcPVsbVwmz4LTfA 

The GUI will display a Tesla Odometer which displays actual velocity, current, bus voltage, and 
temperature in real time.
The RMS current is displayed in a thermometer. If the RMS current exceeds 90% of the continuous 
current, the color of the thermometer will turn red indicating over-heating of the drive.
There is also a virtual motor shaft simulating the actual position of the motor in real time.

The user can change the commanded velocity using the velocity slidebar.
The v-loop limit can also be set using the v-loop textfield and button.

There is a button group where the user can clear the latched faults, jog in the positive
direction, jog in the negative direction, perform a trajectory sequence, home the motor, 
or abort the move. The Jog_Pos function on line 314 in this file has commented code which
displays how to address other drives on the network using their IP address.

*/
'use strict';

let dev = false;

// initialize variables with the value 0
let last_button_pushed, Velocity_Actual, Current_Actual, current_counter, current_0, current_1, current_2, current_3, current_4, current_5, current_6, current_7, current_8, current_9;
last_button_pushed = Velocity_Actual = Current_Actual = current_counter = current_0 = current_1 = current_2 = current_3 = current_4 = current_5 = current_6 = current_7 = current_8 = current_9 = 0;
let velocity_counter, velocity_0, velocity_1, velocity_2, velocity_3, velocity_4, velocity_5, velocity_6, velocity_7, velocity_8, velocity_9, RMS_Current, Vel_RPM, INPUT_VEL_TRACKBAR;
velocity_counter = velocity_0 = velocity_1 = velocity_2 = velocity_3 = velocity_4 = velocity_5 = velocity_6 = velocity_7 = velocity_8 = velocity_9 = RMS_Current = Vel_RPM = INPUT_VEL_TRACKBAR = 0;
let refresh_counter, trackbar_compare_1, trackbar_compare_2, canvas_motor_increment, Act_Pos_over_counts_per_rev_remainder, Act_Pos_compare_value_1, Act_Pos_compare_value_2, Act_Pos;
refresh_counter = trackbar_compare_1 = trackbar_compare_2 = canvas_motor_increment = Act_Pos_over_counts_per_rev_remainder = Act_Pos_compare_value_1 = Act_Pos_compare_value_2 = Act_Pos = 0;

// initialize variables with custom values
let Continuous_Current = 3.0;
let Temperature = 10.0;
let Bus_Voltage = 10.0;
let current_gauge_scalar = 9.8;
let current_gauge_max = 2;
let Counts_Per_Rev = 8000;
let V_Loop_Limit_RPM = 3200;
let ceiling = 4000;
let units = 250;
let RAW_counts_per_rev = 4000;
let RAW_current = 0.3;
let RAW_actual_velocity = 544444;
let RAW_bus_voltage = 24;
let RAW_motor_temp = 60;
let RAW_V_Loop_Limit_RPM = 5333333; 
let canvas_motor_zero_pos = -0.93;

var c = document.getElementById("canvas"); 
c.width = 1150; 
c.height = 650; 
var ctx = c.getContext("2d");

//Rescale the size
ctx.scale(1.3,1.3);

var VelocityGradient = ctx.createLinearGradient(0, 500, 0, 0); VelocityGradient.addColorStop(0, '#00b8fe'); VelocityGradient.addColorStop(1, '#41dcf4');
var rpmGradient = ctx.createLinearGradient(0, 500, 0, 0); rpmGradient.addColorStop(0, '#f7b733'); rpmGradient.addColorStop(1, '#fc4a1a');
draw_thermometer();

        function draw_thermometer(){
            var width = 110,
            height = 600,
            maxTemp = (Continuous_Current*0.9),
            minTemp = (maxTemp*0.7),
            currentTemp = RMS_Current;

            var bottomY = height - 5,
                topY = 5,
                bulbRadius = 20,
                tubeWidth = 21.5,
                tubeBorderWidth = 1,
                innerBulbColor = "rgb(230, 200, 200)",
                tubeBorderColor = "#999999";

            if(RMS_Current<=minTemp){
                var mercuryColor = "rgb(84,230,0)"; // green color
            }
            else if(RMS_Current>minTemp && RMS_Current<=maxTemp){
                var mercuryColor = "rgb(230,100,0)"; // orange color
            }
            else{
                var mercuryColor = "rgb(230,0,0)"; // red color
            }
            
            var bulb_cy = bottomY - bulbRadius, bulb_cx = width/2, top_cy = topY + tubeWidth/2;

            var svg = d3.select("#thermo").append("svg").attr("width", width).attr("height", height);         

            var defs = svg.append("defs");

            // Define the radial gradient for the bulb fill colour
            var bulbGradient = defs.append("radialGradient").attr("id", "bulbGradient").attr("cx", "50%").attr("cy", "50%").attr("r", "50%").attr("fx", "50%").attr("fy", "50%");
            bulbGradient.append("stop").attr("offset", "0%").style("stop-color", innerBulbColor);
            bulbGradient.append("stop").attr("offset", "90%").style("stop-color", mercuryColor);

            // Circle element for rounded tube top
            svg.append("circle").attr("r", tubeWidth/2).attr("cx", width/2).attr("cy", top_cy).style("fill", "#FFFFFF").style("stroke", tubeBorderColor).style("stroke-width", tubeBorderWidth + "px");

            // Rect element for tube
            svg.append("rect").attr("x", width/2 - tubeWidth/2).attr("y", top_cy).attr("height", bulb_cy - top_cy).attr("width", tubeWidth).style("shape-rendering", "crispEdges").style("fill", "#FFFFFF").style("stroke", tubeBorderColor).style("stroke-width", tubeBorderWidth + "px");

            // White fill for rounded tube top circle element
            // to hide the border at the top of the tube rect element
            svg.append("circle").attr("r", tubeWidth/2 - tubeBorderWidth/2).attr("cx", width/2).attr("cy", top_cy).style("fill", "#FFFFFF").style("stroke", "none")

            // Main bulb of thermometer (empty), white fill
            svg.append("circle").attr("r", bulbRadius).attr("cx", bulb_cx).attr("cy", bulb_cy).style("fill", "#FFFFFF").style("stroke", tubeBorderColor).style("stroke-width", tubeBorderWidth + "px");

            // Rect element for tube fill colour
            svg.append("rect").attr("x", width/2 - (tubeWidth - tubeBorderWidth)/2).attr("y", top_cy).attr("height", bulb_cy - top_cy).attr("width", tubeWidth - tubeBorderWidth).style("shape-rendering", "crispEdges").style("fill", "#FFFFFF").style("stroke", "none");

            // Scale step size
            var step = 1;

            // Determine a suitable range of the temperature scale
            var domain = [
            step * Math.floor(minTemp / step), step * Math.ceil(maxTemp / step)
            ];

            if (minTemp - domain[0] < 0.66 * step)
            domain[0] -= step;
            if (domain[1] - maxTemp < 0.66 * step)
            domain[1] += step;

            // D3 scale object
            var scale = d3.scaleLinear().range([bulb_cy - bulbRadius/2 - 8.5, top_cy]).domain(domain);

            // Max and min temperature lines
            [minTemp, maxTemp].forEach(function(t) {
            var isMax = (t == maxTemp), label = (isMax ? "90% Ic" : "70% Ic"), textCol = (isMax ? "rgb(255, 255, 255)" : "rgb(255, 255, 255)"), textOffset = (isMax ? -4 : 4);
            svg.append("line").attr("id", label + "Line").attr("x1", width/2 - tubeWidth/2).attr("x2", width/2 + tubeWidth/2 + 22).attr("y1", scale(t)).attr("y2", scale(t)).style("stroke", tubeBorderColor).style("stroke-width", "1px").style("shape-rendering", "crispEdges");
            svg.append("text").attr("x", width/2 + tubeWidth/2 + 2).attr("y", scale(t) + textOffset).attr("dy", isMax ? null : "0.75em").text(label).style("fill", "#008CBA").style("font-size", "14px")});
            var tubeFill_bottom = bulb_cy, tubeFill_top = scale(currentTemp);

            // Rect element for the red mercury column
            svg.append("rect").attr("x", width/2 - (tubeWidth - 10)/2).attr("y", tubeFill_top).attr("width", tubeWidth - 10).attr("height", tubeFill_bottom - tubeFill_top).style("shape-rendering", "crispEdges").style("fill", mercuryColor); 

            // Main thermometer bulb fill
            svg.append("circle").attr("r", bulbRadius - 6).attr("cx", bulb_cx).attr("cy", bulb_cy).style("fill", "url(#bulbGradient)").style("stroke", mercuryColor).style("stroke-width", "2px");

            // Values to use along the scale ticks up the thermometer
            var tickValues = d3.range((domain[1] - domain[0])/step + 1).map(function(v) { return domain[0] + v * step; });

            // D3 axis object for the temperature scale
            var axis = d3.axisLeft(scale).tickSizeInner(7).tickSizeOuter(0).tickValues(tickValues)            

            // Add the axis to the image
            var svgAxis = svg.append("g").attr("id", "tempScale").attr("transform", "translate(" + (width/2 - tubeWidth/2) + ",0)").call(axis);

            // Format text labels
            svgAxis.selectAll(".tick text").style("fill", "#008CBA").style("font-size", "14px");

            // Set main axis line to no stroke or fill
            svgAxis.select("path").style("stroke", "none").style("fill", "none")

            // Set the style of the ticks 
            svgAxis.selectAll(".tick line").style("stroke", tubeBorderColor).style("shape-rendering", "crispEdges").style("stroke-width", "1px");
        }

        function VelocityNeedle(rotation) {
            ctx.lineWidth = 2; ctx.save(); ctx.translate(250, 250); ctx.rotate(rotation); ctx.strokeRect(-130 / 2 + 170, -1 / 2, 135, 1); ctx.restore(); rotation += Math.PI / 180;
        }

        function rpmNeedle(rotation) {
            ctx.lineWidth = 2; ctx.save(); ctx.translate(250, 250); ctx.rotate(rotation); ctx.strokeRect(-130 / 2 + 170, -1 / 2, 135, 1); ctx.restore(); rotation += Math.PI / 180;
        }

        function drawMiniNeedle(rotation, width, Velocity) {
            ctx.lineWidth = width; ctx.save(); ctx.translate(250, 250); ctx.rotate(rotation); ctx.strokeStyle = "#333"; ctx.fillStyle = "#333";
            ctx.strokeRect(-20 / 2 + 220, -1 / 2, 20, 1); ctx.restore();
            let x = (250 + 180 * Math.cos(rotation)); // shift numbers on odometer to the left
            let y = (250 + 180 * Math.sin(rotation));
            ctx.font = "20px Arial"; ctx.fillText(Velocity, x, y); rotation += Math.PI / 180;
        }

        function calculateVelocityAngle(x, a, b) {
            let degree = (a - b) * (x) + b; let radian = (degree * Math.PI) / 180; return radian <= 1.45 ? radian : 1.45;
        }

        function calculateCurrentAngel(x, a, b) {
            let degree = (a - b) * (x) + b; let radian = (degree * Math.PI) / 180; return radian >= -0.46153862656807704 ? radian : -0.46153862656807704;
        }

        function drawVelocity(Temperature, Bus_Voltage, Velocity, Current, topVelocity, topCurrent, RMS_Current) {
            if (Velocity == undefined) {
                return false;
            } else {
                Velocity = Math.floor(Velocity);
                Current = Current * 10;
            }            

            ctx.clearRect(0, 0, 1150, 650);
            ctx.beginPath(); ctx.fillStyle = 'rgba(0, 0, 0, .9)'; ctx.arc(250, 250, 240, 0, 2 * Math.PI); ctx.fill(); ctx.save(); ctx.restore(); ctx.fillStyle = "#FFF"; ctx.stroke();
            // draw the inner cirle surrounding temp and bus voltage
            ctx.beginPath(); ctx.strokeStyle = "#333"; ctx.lineWidth = 10; ctx.arc(250, 250, 100, 0, 2 * Math.PI); ctx.stroke();
            ctx.beginPath(); ctx.lineWidth = 1; ctx.arc(250, 250, 240, 0, 2 * Math.PI); ctx.stroke(); ctx.fillText("Current", 300, 428); ctx.fillText("(A)", 300, 445);
            ctx.fillText("Speed", 200, 428); ctx.fillText("(RPM)", 200, 445);
            ctx.font = "70px Arial"; ctx.textAlign = "center"; ctx.fillText(Bus_Voltage, 250, 300); ctx.font = "15px Arial"; ctx.fillText("Bus Voltage (V)", 250, 315); ctx.font = "70px Arial"; ctx.textAlign = "center"; ctx.fillText(Temperature, 250, 220);
            ctx.font = "15px Arial"; ctx.fillText("Temperature (C)", 250, 235);

            ctx.fillStyle = "#FFF";
            for (var i = units; i <= Math.ceil(topVelocity / 20) * 20; i += units) {
                console.log();
                drawMiniNeedle(calculateVelocityAngle(i / topVelocity, 83.07888, 34.3775) * Math.PI, i % 20 == 0 ? 3 : 1, i%20 == 0 ? i : '');
            }
            for (var i = 10; i <= Math.ceil((topCurrent*10) / 20) * 20; i += 10) { 
                drawMiniNeedle(calculateVelocityAngle(i / current_gauge_scalar, 0, 22.9183) * Math.PI, i % 20 == 0 ? 3 : 1, i % 20 ==
                0 ?
                i / 10 : '');
            }

            ctx.beginPath(); ctx.strokeStyle = "#41dcf4"; ctx.lineWidth = 20; ctx.shadowBlur = 10; ctx.shadowColor = "#00c6ff";

            ctx.strokeStyle = VelocityGradient;
            ctx.arc(250, 250, 228, .6 * Math.PI, calculateVelocityAngle(Velocity / topVelocity, 83.07888, 34.3775) * Math.PI);
            ctx.stroke(); ctx.beginPath(); ctx.lineWidth = 20; ctx.strokeStyle = rpmGradient; ctx.shadowBlur = 8; ctx.shadowColor = "#f7b733";

            ctx.arc(250, 250, 228, .4 * Math.PI, calculateCurrentAngel(Current / (current_gauge_scalar/10), 0, 22.9183) * Math.PI, true);
            ctx.stroke(); ctx.shadowBlur = 0;

            ctx.strokeStyle = '#41dcf4';
            VelocityNeedle(calculateVelocityAngle(Velocity / topVelocity, 83.07888, 34.3775) * Math.PI);

            ctx.strokeStyle = rpmGradient;
            rpmNeedle(calculateCurrentAngel(Current / (current_gauge_scalar/10), 0, 22.9183) * Math.PI);

            ctx.strokeStyle = "#000";

            // Motor element
            ctx.beginPath(); ctx.arc(740, 260, 130, 0 + canvas_motor_increment, 5 + canvas_motor_increment); ctx.stroke(); ctx.closePath(); ctx.stroke(); ctx.fill();

            Update_Parameters(); // update (get) the velocity, current, RMS current, and other parameters.
            
            // setTimeout will call itself. If the function does not call, the timeout value will terminate the request.
            // The timeout value is set to 150 milliseconds. 
            setTimeout("drawVelocity(Temperature, Bus_Voltage, Vel_RPM,Current_Actual, ceiling, current_gauge_max, RMS_Current);",150);
        }

        // Get the current, v-loop limit, actual velocity, bus voltage, motor temp, actual position, and RMS current. 
        function Update_Parameters(){
            function cb(dat){
                RAW_current = dat.values[0]; 
                RAW_V_Loop_Limit_RPM = dat.values[1]; 
                RAW_actual_velocity = dat.values[2]; 
                RAW_bus_voltage = dat.values[3]; 
                RAW_motor_temp = dat.values[4]; 
                Act_Pos = dat.values[5]; 
                RMS_Current = dat.values[6]; 
                Get_V_Loop_Limit_RPM(); Get_Velocity_Actual(); Update_Bus_Voltage(); Update_Motor_Temp(); Get_Current_Actual(); Update_RMS_Current();
            }
            $.getJSON("_cmd", {type: "get", ids: [0x0c, 0x3a, 0x18, 0x1e, 0x20, 0x17, 0x131]}, cb);
        }

        // Home the motor. First abort the move in progress. Then set the homing configuration parameters.
        // The homing routine is set to "set current position as home". Then home the motor (t 2 command).
        function Home_Function(){
            function cb(dat){
                console.log("Response to Home Command: " + dat);
            }
            
            function start(dat){
                console.log(dat);
                // Start Homing == t 2
                $.getJSON("_cmd", {type: "binary", cmd: 0x11, data: 2}, cb); 
            }    
            function set_parameters(dat){
                console.log(dat);
                // Set Trajectory Profile Mode == s r0xc8 0 ; Set Amp Desired State == s r0x24 21 ; Set Home Configuration == s r0xc2 0x200 
                $.getJSON("_cmd", {type: "set", params:[{id:0xc8, value:0}, {id:0x24, value:21}, {id:0xc2, value:0x200}]}, start);
            }
            // Abort Move == t 0 
            $.getJSON("_cmd", {type: "binary", cmd: 0x11, data: 0}, set_parameters); 
            last_button_pushed = 0;
        }

        // Perform a trajectory sequence. The first move will end with a non-zero velocity
        // that is equal to the starting velocity of the second move. Two moves can be 
        // seamlessly combined without the motor velocity having to drop to zero between them.
        function Traj_Sequence(){
            function cb(dat){
                console.log("Response to Trajectory Sequence Command: " + dat);
            }
            function start(dat){
                console.log(dat);
                // Trajectory Start Command == t 1
                $.getJSON("_cmd", {type: "binary", cmd: 0x11, data: 4}, cb); 
            }
            function save_again(dat){
                console.log(dat);
                // Trajectory Save Command == t 3
                $.getJSON("_cmd", {type: "binary", cmd: 0x11, data: 3}, start); 
            }
            function set_parameters(dat){
                console.log(dat);
                // Set Trajectory Position Command, Trajectory Max Velocity, Trajectory Ending Velocity
                $.getJSON("_cmd", {type: "set", params:[{id:0xca, value:INPUT_VEL_TRACKBAR/2}, {id:0xcb, value:((INPUT_VEL_TRACKBAR)/2)}, {id:0x11b, value:0}]}, save_again);
            }
            function save(dat){
                console.log(dat);
                // Trajectory Save Command == t 3
                $.getJSON("_cmd", {type: "binary", cmd: 0x11, data: 3}, set_parameters);  
            }
            // Set Amp Desired State, Trajectory Profile Mode, Trajectory Position Command, 
            // Trajectory Max Velocity, Trajectory Max Accel, Trajectory Max Decel, Trajectory Ending Velocity
            $.getJSON("_cmd", {type: "set", params:[{id:0x24, value:21}, {id:0xc8, value:256}, {id:0xca, value:INPUT_VEL_TRACKBAR/2}, {id:0xcb, value:INPUT_VEL_TRACKBAR}, {id:0xcc, value:INPUT_VEL_TRACKBAR*10}, {id:0xcd, value:INPUT_VEL_TRACKBAR*10}, {id:0x11b, value:(INPUT_VEL_TRACKBAR)/2}]}, save);
            last_button_pushed = 0;
        }

        // Jog in the positive direction. The commented code illustrates how to address another node on the network.
        // The IP address is used to talk to another drive downstream. 
        function Jog_Pos(){
            function cb( dat ){ 
                console.log("Jog Pos Response: " + dat);
        }
        /*
                function start_2(dat){
                console.log(dat);
                // Start Move == t 1 
                $.getJSON("http://10.10.2.23/_cmd", {type: "binary", cmd: 0x11, data: 1},cb); 
        }
                function set_parameters_2(dat){
                console.log(dat);
                // Set Amp Desired State, Trajectory Profile Mode, Trajectory Position Command, 
                // Trajectory Max Accel, Trajectory Max Decel, Trajectory Max Velocity
                $.getJSON("http://10.10.2.23/_cmd", {type: "set", params:[{id:0x24, value:21}, {id:0xc8, value:2}, {id:0xca, value:1}, {id:0xcb, value:INPUT_VEL_TRACKBAR}, {id:0xcc, value:80000}, {id:0xcd, value:80000}]}, start_2);
        }   
            function abort_move_2(dat){
                // Abort Move == t 0 
                $.getJSON("http://10.10.2.23/_cmd", {type: "binary", cmd: 0x11, data: 0},set_parameters_2); 
        }
        */
            function start(dat){
            console.log(dat);
            // Start Move == t 1 
            $.getJSON("_cmd", {type: "binary", cmd: 0x11, data: 1},cb); 
        }
            function set_parameters(dat){
            console.log(dat);
            // Set Amp Desired State, Trajectory Profile Mode, Trajectory Position Command, 
            // Trajectory Max Accel, Trajectory Max Decel, Trajectory Max Velocity
            $.getJSON("_cmd", {type: "set", params:[{id:0x24, value:21}, {id:0xc8, value:2}, {id:0xca, value:1}, {id:0xcb, value:INPUT_VEL_TRACKBAR}, {id:0xcc, value:80000}, {id:0xcd, value:80000}]}, start);
        }
            // Abort Move == t 0 
            $.getJSON("_cmd", {type: "binary", cmd: 0x11, data: 0},set_parameters); 
            last_button_pushed = 1;
        }

        // Jog in the negative direction. 
        function Jog_Neg(){
            function cb( dat ){ 
            console.log("Jog Neg Response: " + dat);
            }
            function start(dat){
            console.log(dat);
            // Start Move == t 1 
            $.getJSON("_cmd", {type: "binary", cmd: 0x11, data: 1},cb); 
            }
            function set_parameters(dat){
            console.log(dat);
            // Set Amp Desired State, Trajectory Profile Mode, Trajectory Position Command, 
            // Trajectory Max Accel, Trajectory Max Decel, Trajectory Max Velocity
            $.getJSON("_cmd", {type: "set", params:[{id:0x24, value:21}, {id:0xc8, value:2}, {id:0xca, value:-1}, {id:0xcb, value:INPUT_VEL_TRACKBAR}, {id:0xcc, value:80000}, {id:0xcd, value:80000}]}, start);
            }
            // Abort Move == t 0 
            $.getJSON("_cmd", {type: "binary", cmd: 0x11, data: 0},set_parameters); 
            last_button_pushed = 1;
        }

        // The commanded velocity (ASCII parameter 0xcb) is updated if the user changes the 
        // value of the trackbar in the GUI.
        // The commented code illustrates how to address another node (drive) on the network. The 
        // IP address must match the drive's IP address (ASCII parameter 0x11f). 
        function Update_Velocity(){
            function cb( dat ){ 
                //console.log("Jog Neg Response: " + dat);
                }
                /*
            function start_2(dat){
                $.getJSON("http://10.10.2.23/_cmd", {type: "binary", cmd: 0x11, data: 1},cb); 
            }
            function set_parameters_2(dat){
                $.getJSON("http://10.10.2.23/_cmd", {type: "set", params:[{id:0xcb, value:INPUT_VEL_TRACKBAR}]}, start_2);
            }
            */
            function start(dat){
                $.getJSON("_cmd", {type: "binary", cmd: 0x11, data: 1}, cb); 
            }
            $.getJSON("_cmd", {type: "set", params:[{id:0xcb, value:INPUT_VEL_TRACKBAR}]}, start);
        }
        
        // Abort the move (equivalent to ASCII "t 0" command).
        // The commented code illustrates how to address another drive on the network using 
        // its IP address (ASCII parameter 0x11f).
        function Abort_Function(){
            function cb(dat){
            console.log("Response from second drive: " + dat);
            }
            /*
            function abort_drive_2(dat){
                console.log("Response from first drive: "+dat);
                // Abort Move Command to Second Drive
                $.getJSON("http://10.10.2.23/_cmd", {type: "binary", cmd: 0x11, data: 0},cb); 
            }
            */
            // Abort Move Command to First Drive 
            $.getJSON("_cmd", {type: "binary", cmd: 0x11, data: 0}, cb); 
            last_button_pushed = 0;
        }

        function int16(v){
            return(v<<16)>>16;
        }

        // The actual current is averaged over the last 10 readings.
        function Get_Current_Actual(){
            let variable = int16(RAW_current); variable = variable/1000;
            if(variable<0){
                variable = -1*variable;
            }

            if(current_counter==0){
                current_0 = variable; Current_Actual = variable; current_counter = current_counter + 1;
            }
            else if(current_counter==1){
                current_1 = variable; Current_Actual = (current_0 + current_1)/2; current_counter = current_counter + 1;
            }
            else if(current_counter==2){
                current_2 = variable; Current_Actual = (current_0+current_1+current_2)/3; current_counter = current_counter + 1;
            }
            else if(current_counter==3){
                current_3 = variable; Current_Actual = (current_0+current_1+current_2+current_3)/4; current_counter = current_counter + 1;
            }
            else if(current_counter==4){
                current_4 = variable; Current_Actual = (current_0+current_1+current_2+current_3+current_4)/5; current_counter = current_counter + 1;
            }
            else if(current_counter==5){
                current_5 = variable; Current_Actual = (current_0+current_1+current_2+current_3+current_4+current_5)/6; current_counter = current_counter + 1;
            }
            else if(current_counter==6){
                current_6 = variable; Current_Actual = (current_0+current_1+current_2+current_3+current_4+current_5+current_6)/7; current_counter = current_counter + 1;
            }
            else if(current_counter==7){
                current_7 = variable; Current_Actual = (current_0+current_1+current_2+current_3+current_4+current_5+current_6+current_7)/8; current_counter = current_counter + 1;
            }
            else if(current_counter==8){
                current_8 = variable; Current_Actual = (current_0+current_1+current_2+current_3+current_4+current_5+current_6+current_7+current_8)/9; current_counter = current_counter + 1;
            }
            else if(current_counter==9){
                current_9 = variable; Current_Actual = (current_0+current_1+current_2+current_3+current_4+current_5+current_6+current_7+current_8+current_9)/10; current_counter = current_counter + 1;
            }
            else{
                current_0 = current_1; current_1 = current_2; current_2 = current_3; current_3 = current_4; current_4 = current_5; current_5 = current_6; current_6 = current_7; current_7 = current_8; current_8 = current_9; current_9 = variable;
                Current_Actual = (current_0+current_1+current_2+current_3+current_4+current_5+current_6+current_7+current_8+current_9)/10;
            }
        }

        // The actual velocity is averaged over the last 10 readings.
        function Get_Velocity_Actual(){
            let variable = (RAW_actual_velocity/10);
            if(variable<0){
                variable = -1 * variable;
            }
            if(velocity_counter==0){
                velocity_0 = variable; Velocity_Actual = variable; velocity_counter = velocity_counter + 1;
            }
            else if(velocity_counter==1){
                velocity_1 = variable; Velocity_Actual = (velocity_0 + velocity_1)/2; velocity_counter = velocity_counter + 1;
            }
            else if(velocity_counter==2){
                velocity_2 = variable; Velocity_Actual = (velocity_0+velocity_1+velocity_2)/3; velocity_counter = velocity_counter + 1;
            }
            else if(velocity_counter==3){
                velocity_3 = variable; Velocity_Actual = (velocity_0+velocity_1+velocity_2+velocity_3)/4; velocity_counter = velocity_counter + 1;
            }
            else if(velocity_counter==4){
                velocity_4 = variable; Velocity_Actual = (velocity_0+velocity_1+velocity_2+velocity_3+velocity_4)/5; velocity_counter = velocity_counter + 1;
            }
            else if(velocity_counter==5){
                velocity_5 = variable; Velocity_Actual = (velocity_0+velocity_1+velocity_2+velocity_3+velocity_4+velocity_5)/6; velocity_counter = velocity_counter + 1;
            }
            else if(velocity_counter==6){
                velocity_6 = variable; Velocity_Actual = (velocity_0+velocity_1+velocity_2+velocity_3+velocity_4+velocity_5+velocity_6)/7; velocity_counter = velocity_counter + 1;
            }
            else if(velocity_counter==7){
                velocity_7 = variable; Velocity_Actual = (velocity_0+velocity_1+velocity_2+velocity_3+velocity_4+velocity_5+velocity_6+velocity_7)/8; velocity_counter = velocity_counter + 1;
            }
            else if(velocity_counter==8){
                velocity_8 = variable; Velocity_Actual = (velocity_0+velocity_1+velocity_2+velocity_3+velocity_4+velocity_5+velocity_6+velocity_7+velocity_8)/9; velocity_counter = velocity_counter + 1;
            }
            else if(velocity_counter==9){
                velocity_9 = variable; Velocity_Actual = (velocity_0+velocity_1+velocity_2+velocity_3+velocity_4+velocity_5+velocity_6+velocity_7+velocity_8+velocity_9)/10; velocity_counter = velocity_counter + 1;
            }
            else{
                velocity_0 = velocity_1; velocity_1 = velocity_2; velocity_2 = velocity_3; velocity_3 = velocity_4; velocity_4 = velocity_5; velocity_5 = velocity_6; velocity_6 = velocity_7; velocity_7 = velocity_8; velocity_8 = velocity_9; velocity_9 = variable;
                Velocity_Actual = (velocity_0+velocity_1+velocity_2+velocity_3+velocity_4+velocity_5+velocity_6+velocity_7+velocity_8+velocity_9)/10;
            }
            Vel_RPM = (Math.round((Velocity_Actual/Counts_Per_Rev)*60));
        }

        function Set_V_Loop_Limit_RPM(){
            function cb(dat){
                console.log("Response to Set V-Loop Limit Command: " + dat);
            }
                let vel = parseInt($("#VLoopMaxRPMTextfield").val());
                vel= ((vel/60)*Counts_Per_Rev)*10;
                $.getJSON("_cmd", {type: "set", params:[{id:0x3a, value:vel}]}, cb);
        }

        function Clear_Latched_Faults(){
            function cb(dat){
                console.log("Response to Clear Faults Command: " + dat);
            }
                $.getJSON("_cmd", {type: "set", params:[{id:0xa4, value:0xffff}]}, cb);
                last_button_pushed = 0;
        }

        function Refresh_Canvas_Motor(){
            Act_Pos_over_counts_per_rev_remainder =  ((Act_Pos/Counts_Per_Rev)%1)*Counts_Per_Rev; 
            canvas_motor_increment = (((Math.PI)*2)*Act_Pos_over_counts_per_rev_remainder)/Counts_Per_Rev;
            canvas_motor_increment = canvas_motor_zero_pos + canvas_motor_increment;
        }

        function Refresh_Vel_Track_Bar(){
            document.getElementById('myRange').max = V_Loop_Limit_RPM; INPUT_VEL_TRACKBAR = parseInt($("#myRange").val()); document.getElementById('VelocityDisplayRPM').value=INPUT_VEL_TRACKBAR; INPUT_VEL_TRACKBAR= ((INPUT_VEL_TRACKBAR/60)*Counts_Per_Rev)*10;
            
            if (refresh_counter == 0){
                trackbar_compare_1 = INPUT_VEL_TRACKBAR; Act_Pos_compare_value_1 = Act_Pos; refresh_counter = refresh_counter + 1;
            }
            else if (refresh_counter == 1){
                trackbar_compare_2 = INPUT_VEL_TRACKBAR; Act_Pos_compare_value_2 = Act_Pos; refresh_counter = 0;
            }
            if(last_button_pushed==1){
                if(trackbar_compare_1 != trackbar_compare_2){
                    console.log("trackbar compare value 1: "+trackbar_compare_1 + " trackbar compare value 2: "+trackbar_compare_2); Update_Velocity();
                }
            }
            if(Act_Pos_compare_value_1!=Act_Pos_compare_value_2){
                Refresh_Canvas_Motor();
            }
        }

        function Get_V_Loop_Limit_RPM(){
            let variable = (RAW_V_Loop_Limit_RPM/10); V_Loop_Limit_RPM = (Math.round((variable/Counts_Per_Rev)*60));
            ceiling = Math.ceil(V_Loop_Limit_RPM/1000)*1000; units = (ceiling*0.0625); Refresh_Vel_Track_Bar();
        }

        function Update_Bus_Voltage(){
            let variable = (RAW_bus_voltage/10); variable = Math.round(variable); Bus_Voltage = variable.toString();
        }
        
        function Update_RMS_Current(){
            d3.selectAll('#thermo svg').remove(); // erase old thermometer
            RMS_Current = RMS_Current/100;        // unit conversion for the display (Amps)
            draw_thermometer();                   // draw new thermometer
        }

        function Update_Motor_Temp(){
            let variable = (RAW_motor_temp); Temperature = variable.toString();
        }

        function Get_Parameters_On_Startup(){
            function cb(dat){
                RAW_counts_per_rev = dat.values[0]; 
                Continuous_Current = dat.values[1]; 
                console.log("Counts Per Rev: "+ RAW_counts_per_rev); 
                console.log("Continuous Current Limit: " + (Continuous_Current/100)); 
                Counts_Per_Rev = RAW_counts_per_rev;
                Continuous_Current = Continuous_Current/100;
            }
            $.getJSON("_cmd", {type: "get", ids: [0x1062, 0x22]}, cb);
        }
        
        function Begin_JavaScript() {   
            Get_Parameters_On_Startup();
            drawVelocity(Temperature, Bus_Voltage, Vel_RPM,Current_Actual, ceiling, current_gauge_max, RMS_Current);
          }
'use strict';

let dev = false;
let last_button_pushed = 0;
let Temperature_1 = 10.0;
let Temperature_2 = 10.0;
let Bus_Voltage_1 = 10.0;
let Bus_Voltage_2 = 10.0;
let Velocity_Actual_1 = 0;
let Velocity_Actual_2 = 0;
let Current_Actual_1 = 0;
let Current_Actual_2 = 0;

let Act_Pos_1 = 1000;
let Act_Pos_2 = 1000;
let target_position_1 = 10000;
let target_position_2 = 10000;
let compare_value_1 = 0;
let compare_value_2 = 0;
let previous_cycle_1 = 0;
let previous_cycle_2 = 0;
let multiplier_in_decimal_form_1 = 0;
let multiplier_in_decimal_form_2 = 0;
let laser_fire_offset_1 = 2000;
let laser_fire_offset_2 = 2000;

let current_counter = 0;
let current_1_0 = 0;
let current_1_1 = 0;
let current_1_2 = 0;
let current_1_3 = 0;
let current_1_4 = 0;
let current_1_5 = 0;
let current_1_6 = 0;
let current_1_7 = 0;
let current_1_8 = 0;
let current_1_9 = 0;
let current_2_0 = 0;
let current_2_1 = 0;
let current_2_2 = 0;
let current_2_3 = 0;
let current_2_4 = 0;
let current_2_5 = 0;
let current_2_6 = 0;
let current_2_7 = 0;
let current_2_8 = 0;
let current_2_9 = 0;
let velocity_counter = 0;
let velocity_1_0 = 0;
let velocity_1_1 = 0;
let velocity_1_2 = 0;
let velocity_1_3 = 0;
let velocity_1_4 = 0;
let velocity_1_5 = 0;
let velocity_1_6 = 0;
let velocity_1_7 = 0;
let velocity_1_8 = 0;
let velocity_1_9 = 0;
let velocity_2_0 = 0;
let velocity_2_1 = 0;
let velocity_2_2 = 0;
let velocity_2_3 = 0;
let velocity_2_4 = 0;
let velocity_2_5 = 0;
let velocity_2_6 = 0;
let velocity_2_7 = 0;
let velocity_2_8 = 0;
let velocity_2_9 = 0;

let Counts_Per_Rev_1 = 8000;
let Counts_Per_Rev_2 = 8000;
let Vel_RPM_1 = 0;
let Vel_RPM_2 = 0;
let V_Loop_Limit_RPM_1 = 3200;
let V_Loop_Limit_RPM_2 = 3200;
let ceiling_1 = 4000;
let ceiling_2 = 4000;
let units_1 = 250;
let units_2 = 250;
let current_gauge_scalar = 9.8;
let current_gauge_max = 2;
let INPUT_VEL_TRACKBAR_1 = 0;
let INPUT_VEL_TRACKBAR_2 = 0;
let RAW_counts_per_rev_1 = 4000;
let RAW_counts_per_rev_2 = 4000;
let RAW_current_1 = 0.3;
let RAW_current_2 = 0.3;
let RAW_actual_velocity_1 = 544444;
let RAW_actual_velocity_2 = 544444;
let RAW_bus_voltage_1 = 24;
let RAW_bus_voltage_2 = 24;
let RAW_motor_temp_1 = 60;
let RAW_motor_temp_2 = 60;
let RAW_V_Loop_Limit_RPM_1 = 5333333;
let RAW_V_Loop_Limit_RPM_2 = 5333333;
let refresh_counter = 0;
let trackbar_compare_1 = 0;
let trackbar_compare_2 = 0;
        
        var c = document.getElementById("canvas");
        c.width = 650;
        c.height = 650;
        
        var ctx = c.getContext("2d");

        //Rescale the size
        ctx.scale(1.3,1.3);

        var c2 = document.getElementById("canvas2");
        c2.width = 650;
        c2.height = 650;
        
        var ctx2 = c2.getContext("2d");

        //Rescale the size
        ctx2.scale(1.3,1.3);

        var VelocityGradient_1 = ctx.createLinearGradient(0, 500, 0, 0);
        VelocityGradient_1.addColorStop(0, '#00b8fe');
        VelocityGradient_1.addColorStop(1, '#41dcf4');

        var rpmGradient_1 = ctx.createLinearGradient(0, 500, 0, 0);
        rpmGradient_1.addColorStop(0, '#f7b733');
        rpmGradient_1.addColorStop(1, '#fc4a1a');

        var VelocityGradient_2 = ctx2.createLinearGradient(0, 500, 0, 0);
        VelocityGradient_2.addColorStop(0, '#00b8fe');
        VelocityGradient_2.addColorStop(1, '#41dcf4');

        var rpmGradient_2 = ctx2.createLinearGradient(0, 500, 0, 0);
        rpmGradient_2.addColorStop(0, '#f7b733');
        rpmGradient_2.addColorStop(1, '#fc4a1a');

        function VelocityNeedle_1(rotation) {
            ctx.lineWidth = 2;

            ctx.save();
            ctx.translate(250, 250);
            ctx.rotate(rotation);
            ctx.strokeRect(-130 / 2 + 170, -1 / 2, 135, 1);
            ctx.restore();

            rotation += Math.PI / 180;
        }

        function VelocityNeedle_2(rotation) {
            ctx2.lineWidth = 2;
            ctx2.save();
            ctx2.translate(250, 250);
            ctx2.rotate(rotation);
            ctx2.strokeRect(-130 / 2 + 170, -1 / 2, 135, 1);
            ctx2.restore();

            rotation += Math.PI / 180;
        }

        function rpmNeedle_1(rotation) {
            ctx.lineWidth = 2;

            ctx.save();
            ctx.translate(250, 250);
            ctx.rotate(rotation);
            ctx.strokeRect(-130 / 2 + 170, -1 / 2, 135, 1);
            ctx.restore();

            rotation += Math.PI / 180;
        }

        function rpmNeedle_2(rotation) {
            ctx2.lineWidth = 2;

            ctx2.save();
            ctx2.translate(250, 250);
            ctx2.rotate(rotation);
            ctx2.strokeRect(-130 / 2 + 170, -1 / 2, 135, 1);
            ctx2.restore();

            rotation += Math.PI / 180;
        }

        function drawMiniNeedle_1(rotation, width, Velocity) {
            ctx.lineWidth = width;

            ctx.save();
            ctx.translate(250, 250);
            ctx.rotate(rotation);
            ctx.strokeStyle = "#333";
            ctx.fillStyle = "#333";
            ctx.strokeRect(-20 / 2 + 220, -1 / 2, 20, 1);
            ctx.restore();

            let x = (250 + 180 * Math.cos(rotation)); // shift numbers on odometer to the left
            let y = (250 + 180 * Math.sin(rotation));

            ctx.font = "20px Arial";
            ctx.fillText(Velocity, x, y);

            rotation += Math.PI / 180;
        }

        function drawMiniNeedle_2(rotation, width, Velocity) {
            ctx2.lineWidth = width;

            ctx2.save();
            ctx2.translate(250, 250);
            ctx2.rotate(rotation);
            ctx2.strokeStyle = "#333";
            ctx2.fillStyle = "#333";
            ctx2.strokeRect(-20 / 2 + 220, -1 / 2, 20, 1);
            ctx2.restore();

            let x = (250 + 180 * Math.cos(rotation)); // shift numbers on odometer to the left
            let y = (250 + 180 * Math.sin(rotation));

            ctx2.font = "20px Arial";
            ctx2.fillText(Velocity, x, y);

            rotation += Math.PI / 180;
        }

        function calculateVelocityAngle(x, a, b) {
            let degree = (a - b) * (x) + b;
            let radian = (degree * Math.PI) / 180;
            return radian <= 1.45 ? radian : 1.45;
        }

        function calculateCurrentAngel(x, a, b) {
            let degree = (a - b) * (x) + b;
            let radian = (degree * Math.PI) / 180;
            return radian >= -0.46153862656807704 ? radian : -0.46153862656807704;
        }

        function drawVelocity(Temperature_1, Bus_Voltage_1, Velocity_1, Current_1, topVelocity_1, topCurrent, Temperature_2, Bus_Voltage_2, Velocity_2, Current_2, topVelocity_2,) {
            
            if (Velocity_1 == undefined) {
                return false;
            } else {
                Velocity_1 = Math.floor(Velocity_1);
                Current_1 = Current_1 * 10;
            }

            if (Velocity_2 == undefined) {
                return false;
            } else {
                Velocity_2 = Math.floor(Velocity_2);
                Current_2 = Current_2 * 10;
            }

            ctx.clearRect(0, 0, 500, 500);

            ctx.beginPath();
            ctx.fillStyle = 'rgba(0, 0, 0, .9)';
            ctx.arc(250, 250, 240, 0, 2 * Math.PI);
            ctx.fill();
            ctx.save()
            ctx.restore();
            ctx.fillStyle = "#FFF";
            ctx.stroke();

            ctx2.clearRect(0, 0, 500, 500);

            ctx2.beginPath();
            ctx2.fillStyle = 'rgba(0, 0, 0, .9)';
            ctx2.arc(250, 250, 240, 0, 2 * Math.PI);
            ctx2.fill();
            ctx2.save()
            ctx2.restore();
            ctx2.fillStyle = "#FFF";
            ctx2.stroke();
            
            // draw the inner cirle surrounding temp and bus voltage
            ctx.beginPath();
            ctx.strokeStyle = "#333";
            ctx.lineWidth = 10;
            ctx.arc(250, 250, 100, 0, 2 * Math.PI);
            ctx.stroke();

            ctx2.beginPath();
            ctx2.strokeStyle = "#333";
            ctx2.lineWidth = 10;
            ctx2.arc(250, 250, 100, 0, 2 * Math.PI);
            ctx2.stroke();

            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.arc(250, 250, 240, 0, 2 * Math.PI);
            ctx.stroke();

            ctx2.beginPath();
            ctx2.lineWidth = 1;
            ctx2.arc(250, 250, 240, 0, 2 * Math.PI);
            ctx2.stroke();

            ctx.fillText("Current", 300, 428);
            ctx.fillText("(A)", 300, 445);
    
            ctx.fillText("Speed", 200, 428);
            ctx.fillText("(RPM)", 200, 445);

            ctx2.fillText("Current", 300, 428);
            ctx2.fillText("(A)", 300, 445);
    
            ctx2.fillText("Speed", 200, 428);
            ctx2.fillText("(RPM)", 200, 445);

            ctx.font = "70px Arial";
            ctx.textAlign = "center";
            ctx.fillText(Bus_Voltage_1, 250, 300);
            ctx.font = "15px Arial";
            ctx.fillText("Bus Voltage (V)", 250, 315);

            ctx2.font = "70px Arial";
            ctx2.textAlign = "center";
            ctx2.fillText(Bus_Voltage_2, 250, 300);
            ctx2.font = "15px Arial";
            ctx2.fillText("Bus Voltage (V)", 250, 315);

            ctx.font = "70px Arial";
            ctx.textAlign = "center";
            ctx.fillText(Temperature_1, 250, 220);

            ctx2.font = "70px Arial";
            ctx2.textAlign = "center";
            ctx2.fillText(Temperature_2, 250, 220);

            ctx.font = "15px Arial";
            ctx.fillText("Temperature (C)", 250, 235);

            ctx2.font = "15px Arial";
            ctx2.fillText("Temperature (C)", 250, 235);

            /////////////////////////////////////////////////////

            Update_Parameters();

            ctx.fillStyle = "#FFF";
            for (var i = units_1; i <= Math.ceil(topVelocity_1 / 20) * 20; i += units_1) {
                console.log();
                drawMiniNeedle_1(calculateVelocityAngle(i / topVelocity_1, 83.07888, 34.3775) * Math.PI, i % 20 == 0 ? 3 : 1, i%20 == 0 ? i : '');
            }
            for (var i = 10; i <= Math.ceil((topCurrent*10) / 20) * 20; i += 10) { 
                drawMiniNeedle_1(calculateVelocityAngle(i / current_gauge_scalar, 0, 22.9183) * Math.PI, i % 20 == 0 ? 3 : 1, i % 20 ==
                0 ?
                i / 10 : '');
            }

            ctx2.fillStyle = "#FFF";
            for (var i = units_1; i <= Math.ceil(topVelocity_2 / 20) * 20; i += units_1) {
                console.log();
                drawMiniNeedle_2(calculateVelocityAngle(i / topVelocity_2, 83.07888, 34.3775) * Math.PI, i % 20 == 0 ? 3 : 1, i%20 == 0 ? i : '');
            }
            for (var i = 10; i <= Math.ceil((topCurrent*10) / 20) * 20; i += 10) { 
                drawMiniNeedle_2(calculateVelocityAngle(i / current_gauge_scalar, 0, 22.9183) * Math.PI, i % 20 == 0 ? 3 : 1, i % 20 ==
                0 ?
                i / 10 : '');
            }

            ctx.beginPath();
            ctx.strokeStyle = "#41dcf4";
            ctx.lineWidth = 20;
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#00c6ff";

            ctx2.beginPath();
            ctx2.strokeStyle = "#41dcf4";
            ctx2.lineWidth = 20;
            ctx2.shadowBlur = 10;
            ctx2.shadowColor = "#00c6ff";

            ctx.strokeStyle = VelocityGradient_1;
            ctx.arc(250, 250, 228, .6 * Math.PI, calculateVelocityAngle(Velocity_1 / topVelocity_1, 83.07888, 34.3775) * Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.lineWidth = 20;
            ctx.strokeStyle = rpmGradient_1;
            ctx.shadowBlur = 8;
            ctx.shadowColor = "#f7b733";

            ctx2.strokeStyle = VelocityGradient_2;
            ctx2.arc(250, 250, 228, .6 * Math.PI, calculateVelocityAngle(Velocity_2 / topVelocity_2, 83.07888, 34.3775) * Math.PI);
            ctx2.stroke();
            ctx2.beginPath();
            ctx2.lineWidth = 20;
            ctx2.strokeStyle = rpmGradient_2;
            ctx2.shadowBlur = 8;
            ctx2.shadowColor = "#f7b733";

            ctx.arc(250, 250, 228, .4 * Math.PI, calculateCurrentAngel(Current_1 / (current_gauge_scalar/10), 0, 22.9183) * Math.PI, true);
            ctx.stroke();
            ctx.shadowBlur = 0;

            ctx2.arc(250, 250, 228, .4 * Math.PI, calculateCurrentAngel(Current_2 / (current_gauge_scalar/10), 0, 22.9183) * Math.PI, true);
            ctx2.stroke();
            ctx2.shadowBlur = 0;

            ctx.strokeStyle = '#41dcf4';
            VelocityNeedle_1(calculateVelocityAngle(Velocity_1 / topVelocity_1, 83.07888, 34.3775) * Math.PI);

            ctx2.strokeStyle = '#41dcf4';
            VelocityNeedle_2(calculateVelocityAngle(Velocity_2 / topVelocity_2, 83.07888, 34.3775) * Math.PI);

            ctx.strokeStyle = rpmGradient_1;
            rpmNeedle_1(calculateCurrentAngel(Current_1 / (current_gauge_scalar/10), 0, 22.9183) * Math.PI);

            ctx.strokeStyle = "#000";

            ctx2.strokeStyle = rpmGradient_2;
            rpmNeedle_2(calculateCurrentAngel(Current_2 / (current_gauge_scalar/10), 0, 22.9183) * Math.PI);

            ctx2.strokeStyle = "#000";
                        
            setTimeout("drawVelocity(Temperature_1, Bus_Voltage_1, Vel_RPM_1,Current_Actual_1, ceiling_1, current_gauge_max, Temperature_2, Bus_Voltage_2, Vel_RPM_2,Current_Actual_2, ceiling_1);",250);
        }

        function Update_Parameters(){

            function cb(dat){
                RAW_current_1 = dat.values[0];
                RAW_V_Loop_Limit_RPM_1 = dat.values[1];
                RAW_actual_velocity_1 = dat.values[2];
                RAW_bus_voltage_1 = dat.values[3];
                RAW_motor_temp_1 = dat.values[4];
                RAW_current_2 = dat.values[5];
                //RAW_V_Loop_Limit_RPM_2 = dat.values[6];
                RAW_actual_velocity_2 = dat.values[6];
                RAW_bus_voltage_2 = dat.values[7];
                RAW_motor_temp_2 = dat.values[8];
                Get_V_Loop_Limit_RPM();
                Get_Velocity_Actual();
                Update_Bus_Voltage();
                Update_Motor_Temp();
                Get_Current_Actual();
            }
            $.getJSON("_cmd", {type: "get", ids: [0x0c, 0x3a, 0x18, 0x1e, 0x20, 0x200c, 0x2018, 0x201e, 0x2020]}, cb);

        }

        function Traj_Sequence(){
            function cb(dat){
                console.log("Response to Trajectory Sequence Command: " + dat);

            }
            function start(dat){
                console.log(dat);
                // Trajectory Start Command == t 1
                $.getJSON("_cmd", {type: "binary", cmd: 0x11, data: 0x3004}, cb); 
            }
            function save_again(dat){
                console.log(dat);
                // Trajectory Save Command == t 3
                $.getJSON("_cmd", {type: "binary", cmd: 0x11, data: 0x3003}, start); 
            }

            function set_parameters_2(dat){
                console.log(dat);
                $.getJSON("_cmd", {type: "set", params:[{id:0x20ca, value:INPUT_VEL_TRACKBAR_2/2}, {id:0x20cb, value:((INPUT_VEL_TRACKBAR_2)/2)}, {id:0x2011b, value:0}]}, save_again);

            }

            function set_parameters(dat){
                console.log(dat);
                // Set Trajectory Position Command, Trajectory Max Velocity, Trajectory Ending Velocity
                $.getJSON("_cmd", {type: "set", params:[{id:0xca, value:INPUT_VEL_TRACKBAR_1/2}, {id:0xcb, value:((INPUT_VEL_TRACKBAR_1)/2)}, {id:0x11b, value:0}]}, set_parameters_2);
            }
            function save(dat){
                console.log(dat);
                // Trajectory Save Command == t 3
                $.getJSON("_cmd", {type: "binary", cmd: 0x11, data: 0x3003}, set_parameters);  
            }
            function set_param_2(dat){
                console.log(dat);
                $.getJSON("_cmd", {type: "set", params:[{id:0x2024, value:21}, {id:0x20c8, value:256}, {id:0x20ca, value:INPUT_VEL_TRACKBAR_2/2}, {id:0x20cb, value:INPUT_VEL_TRACKBAR_2}, {id:0x20cc, value:INPUT_VEL_TRACKBAR_2*10}, {id:0x20cd, value:INPUT_VEL_TRACKBAR_2*10}, {id:0x2011b, value:(INPUT_VEL_TRACKBAR_2)/2}]}, save);
            }
            // Set Amp Desired State, Trajectory Profile Mode, Trajectory Position Command, 
            // Trajectory Max Velocity, Trajectory Max Accel, Trajectory Max Decel, Trajectory Ending Velocity
            $.getJSON("_cmd", {type: "set", params:[{id:0x24, value:21}, {id:0xc8, value:256}, {id:0xca, value:INPUT_VEL_TRACKBAR_1/2}, {id:0xcb, value:INPUT_VEL_TRACKBAR_1}, {id:0xcc, value:INPUT_VEL_TRACKBAR_1*10}, {id:0xcd, value:INPUT_VEL_TRACKBAR_1*10}, {id:0x11b, value:(INPUT_VEL_TRACKBAR_1)/2}]}, set_param_2);
            last_button_pushed = 0;
        }

        function Jog_Pos(){
            function cb( dat ){ 
            console.log("Jog Pos Response: " + dat);
        }
            function start(dat){
            console.log(dat);
            // Start Move == t 1 
            $.getJSON("_cmd", {type: "binary", cmd: 0x11, data: 0x3001},cb); 
        }
            function set_parameters_2(dat){
            console.log(dat);
            // Set Amp Desired State, Trajectory Profile Mode, Trajectory Position Command, 
            // Trajectory Max Accel, Trajectory Max Decel, Trajectory Max Velocity
            $.getJSON("_cmd", {type: "set", params:[{id:0x2024, value:21}, {id:0x20c8, value:2}, {id:0x20ca, value:1}, {id:0x20cb, value:INPUT_VEL_TRACKBAR_2}, {id:0x20cc, value:80000}, {id:0x20cd, value:80000}]}, start);
        }
            function set_parameters_1(dat){
            console.log(dat);
            // Set Amp Desired State, Trajectory Profile Mode, Trajectory Position Command, 
            // Trajectory Max Accel, Trajectory Max Decel, Trajectory Max Velocity
            $.getJSON("_cmd", {type: "set", params:[{id:0x24, value:21}, {id:0xc8, value:2}, {id:0xca, value:1}, {id:0xcb, value:INPUT_VEL_TRACKBAR_1}, {id:0xcc, value:80000}, {id:0xcd, value:80000}]}, set_parameters_2);
        }
            // Abort Move == t 0 
            $.getJSON("_cmd", {type: "binary", cmd: 0x11, data: 0x3000},set_parameters_1); 
            last_button_pushed = 1;
        }

        function Jog_Neg(){
            function cb( dat ){ 
            console.log("Jog Neg Response: " + dat);
            }
            function start(dat){
            console.log(dat);
            // Start Move == t 1 
            $.getJSON("_cmd", {type: "binary", cmd: 0x11, data: 0x3001},cb); 
            }
            function set_parameters_2(dat){
                console.log(dat);
                // Set Amp Desired State, Trajectory Profile Mode, Trajectory Position Command, 
                // Trajectory Max Accel, Trajectory Max Decel, Trajectory Max Velocity
                $.getJSON("_cmd", {type: "set", params:[{id:0x2024, value:21}, {id:0x20c8, value:2}, {id:0x20ca, value:-1}, {id:0x20cb, value:INPUT_VEL_TRACKBAR_2}, {id:0x20cc, value:80000}, {id:0x20cd, value:80000}]}, start);
            }
            function set_parameters_1(dat){
            console.log(dat);
            // Set Amp Desired State, Trajectory Profile Mode, Trajectory Position Command, 
            // Trajectory Max Accel, Trajectory Max Decel, Trajectory Max Velocity
            $.getJSON("_cmd", {type: "set", params:[{id:0x24, value:21}, {id:0xc8, value:2}, {id:0xca, value:-1}, {id:0xcb, value:INPUT_VEL_TRACKBAR_1}, {id:0xcc, value:80000}, {id:0xcd, value:80000}]}, set_parameters_2);
            }
            // Abort Move == t 0 
            $.getJSON("_cmd", {type: "binary", cmd: 0x11, data: 0x3000},set_parameters_1); 
            last_button_pushed = 1;
        }

        function Update_Velocity(){
            function cb( dat ){ 
                //console.log("Jog Neg Response: " + dat);
                }
            function start(dat){
                $.getJSON("_cmd", {type: "binary", cmd: 0x11, data: 0x3001},cb); 
            }
            $.getJSON("_cmd", {type: "set", params:[{id:0xcb, value:INPUT_VEL_TRACKBAR_1}, {id:0x20cb, value:INPUT_VEL_TRACKBAR_2}]}, start);
        }

        function floor(v){
            return(Math.floor(v));
        }

        function E_Stop_And_Align(){

            function cb(dat){
                console.log("E Stop and Align Motors Command: " + dat);
            }

            function start(dat){
                // Start Move == t 1 
                $.getJSON("_cmd", {type: "binary", cmd: 0x11, data: 0x3001},cb); 
            }

            function assign_pos_2(dat){
                laser_fire_offset_2 = (Counts_Per_Rev_2/4) - parseInt($("#rangeOffset").val());
                multiplier_in_decimal_form_2 = Act_Pos_2/Counts_Per_Rev_2;
                multiplier_in_decimal_form_2 = floor(multiplier_in_decimal_form_2);
                previous_cycle_2 = multiplier_in_decimal_form_2*Counts_Per_Rev_2;
                target_position_2 = previous_cycle_2 + laser_fire_offset_2;  // insert offset here
                $.getJSON("_cmd", {type: "set", params:[{id:0x2024, value:21}, {id:0x20c8, value:1}, {id:0x20ca, value:target_position_2}, {id:0x20cb, value:INPUT_VEL_TRACKBAR_2}, {id:0x20cc, value:INPUT_VEL_TRACKBAR_2*10}, {id:0x20cd, value:INPUT_VEL_TRACKBAR_2*10}, {id:0x11b, value:0}]}, start);
            }

            function assign_pos_1(dat){
                laser_fire_offset_1 = (Counts_Per_Rev_1/4) + parseInt($("#rangeOffset").val());
                Act_Pos_1 = dat.values[0];
                Act_Pos_2 = dat.values[1];
                multiplier_in_decimal_form_1 = Act_Pos_1/Counts_Per_Rev_1;
                multiplier_in_decimal_form_1 = floor(multiplier_in_decimal_form_1);
                previous_cycle_1 = multiplier_in_decimal_form_1*Counts_Per_Rev_1;
                target_position_1 = previous_cycle_1 + laser_fire_offset_1; // insert offset here
                $.getJSON("_cmd", {type: "set", params:[{id:0x24, value:21}, {id:0xc8, value:1}, {id:0xca, value:target_position_1}, {id:0xcb, value:INPUT_VEL_TRACKBAR_1}, {id:0xcc, value:INPUT_VEL_TRACKBAR_1*10}, {id:0xcd, value:INPUT_VEL_TRACKBAR_1*10}, {id:0x11b, value:0}]}, assign_pos_2);
            }

            //0x32 = motor position
            function Get_Pos(dat){
                console.log(dat);
                $.getJSON("_cmd", {type: "get", ids: [0x32, 0x2032]}, assign_pos_1);
            }
            $.getJSON("_cmd", {type: "binary", cmd: 0x11, data: 0x3000}, Get_Pos); 
            last_button_pushed = 0;
        }

        function Configure_Output_Function(){
            
            function cb(dat){
                console.log("Response to Align Motors and Configure Output Command: " + dat);
        }
            function config_output(dat){   
                Act_Pos_1 = dat.values[0];
                Act_Pos_2 = dat.values[1];      
                compare_value_1 = Act_Pos_1 - (Counts_Per_Rev_1/4);
                compare_value_2 = Act_Pos_1 + (Counts_Per_Rev_1/4);
                $.getJSON("_cmd", {type: "set", params:[{id:0x70, value:16}, {id:0x185, value:1}, {id:0x187, value:compare_value_1}, {id:0x188, value:compare_value_2}, {id:0x189, value:Counts_Per_Rev_1}, {id:0x18a, value:762144}]}, cb);
            }
            last_button_pushed = 0;
            $.getJSON("_cmd", {type: "get", ids: [0x32, 0x2032]}, config_output);
        }

        function int16(v){
            return(v<<16)>>16;
        }

        function Get_Current_Actual(){
            let variable_1 = int16(RAW_current_1);
            let variable_2 = int16(RAW_current_2);

            variable_1 = variable_1/1000;
            variable_2 = variable_2/1000;

            if(variable_1<0){
                variable_1 = -1*variable_1;
            }
            if(variable_2<0){
                variable_2 = -1*variable_2;
            }

            if(current_counter==0){
                current_1_0 = variable_1;
                current_2_0 = variable_2;
                Current_Actual_1 = variable_1;
                Current_Actual_2 = variable_2;
                current_counter = current_counter + 1;
            }
            else if(current_counter==1){
                current_1_1 = variable_1;
                current_2_1 = variable_2;
                Current_Actual_1 = (current_1_0 + current_1_1)/2;
                Current_Actual_2 = (current_2_0 + current_2_1)/2;
                current_counter = current_counter + 1;
            }
            else if(current_counter==2){
                current_1_2 = variable_1;
                current_2_2 = variable_2;
                Current_Actual_1 = (current_1_0+current_1_1+current_1_2)/3;
                Current_Actual_2 = (current_2_0+current_2_1+current_2_2)/3;
                current_counter = current_counter + 1;
            }
            else if(current_counter==3){
                current_1_3 = variable_1;
                current_2_3 = variable_2;
                Current_Actual_1 = (current_1_0+current_1_1+current_1_2+current_1_3)/4;
                Current_Actual_2 = (current_2_0+current_2_1+current_2_2+current_2_3)/4;
                current_counter = current_counter + 1;
            }
            else if(current_counter==4){
                current_1_4 = variable_1;
                current_2_4 = variable_2;
                Current_Actual_1 = (current_1_0+current_1_1+current_1_2+current_1_3+current_1_4)/5;
                Current_Actual_2 = (current_2_0+current_2_1+current_2_2+current_2_3+current_2_4)/5;
                current_counter = current_counter + 1;
            }
            else if(current_counter==5){
                current_1_5 = variable_1;
                current_2_5 = variable_2;
                Current_Actual_1 = (current_1_0+current_1_1+current_1_2+current_1_3+current_1_4+current_1_5)/6;
                Current_Actual_2 = (current_2_0+current_2_1+current_2_2+current_2_3+current_2_4+current_2_5)/6;
                current_counter = current_counter + 1;
            }
            else if(current_counter==6){
                current_1_6 = variable_1;
                current_2_6 = variable_2;
                Current_Actual_1 = (current_1_0+current_1_1+current_1_2+current_1_3+current_1_4+current_1_5+current_1_6)/7;
                Current_Actual_2 = (current_2_0+current_2_1+current_2_2+current_2_3+current_2_4+current_2_5+current_2_6)/7;
                current_counter = current_counter + 1;
            }
            else if(current_counter==7){
                current_1_7 = variable_1;
                current_2_7 = variable_2;
                Current_Actual_1 = (current_1_0+current_1_1+current_1_2+current_1_3+current_1_4+current_1_5+current_1_6+current_1_7)/8;
                Current_Actual_2 = (current_2_0+current_2_1+current_2_2+current_2_3+current_2_4+current_2_5+current_2_6+current_2_7)/8;
                current_counter = current_counter + 1;
            }
            else if(current_counter==8){
                current_1_8 = variable_1;
                current_2_8 = variable_2;
                Current_Actual_1 = (current_1_0+current_1_1+current_1_2+current_1_3+current_1_4+current_1_5+current_1_6+current_1_7+current_1_8)/9;
                Current_Actual_2 = (current_2_0+current_2_1+current_2_2+current_2_3+current_2_4+current_2_5+current_2_6+current_2_7+current_2_8)/9;
                current_counter = current_counter + 1;
            }
            else if(current_counter==9){
                current_1_9 = variable_1;
                current_2_9 = variable_2;
                Current_Actual_1 = (current_1_0+current_1_1+current_1_2+current_1_3+current_1_4+current_1_5+current_1_6+current_1_7+current_1_8+current_1_9)/10;
                Current_Actual_2 = (current_2_0+current_2_1+current_2_2+current_2_3+current_2_4+current_2_5+current_2_6+current_2_7+current_2_8+current_2_9)/10;
                current_counter = current_counter + 1;
            }
            else{
                current_1_0 = current_1_1;
                current_1_1 = current_1_2;
                current_1_2 = current_1_3;
                current_1_3 = current_1_4;
                current_1_4 = current_1_5;
                current_1_5 = current_1_6;
                current_1_6 = current_1_7;
                current_1_7 = current_1_8;
                current_1_8 = current_1_9;
                current_1_9 = variable_1;
                Current_Actual_1 = (current_1_0+current_1_1+current_1_2+current_1_3+current_1_4+current_1_5+current_1_6+current_1_7+current_1_8+current_1_9)/10;
                current_2_0 = current_2_1;
                current_2_1 = current_2_2;
                current_2_2 = current_2_3;
                current_2_3 = current_2_4;
                current_2_4 = current_2_5;
                current_2_5 = current_2_6;
                current_2_6 = current_2_7;
                current_2_7 = current_2_8;
                current_2_8 = current_2_9;
                current_2_9 = variable_2;
                Current_Actual_2 = (current_2_0+current_2_1+current_2_2+current_2_3+current_2_4+current_2_5+current_2_6+current_2_7+current_2_8+current_2_9)/10;
            }
        }

        function Get_Velocity_Actual(){
            let variable_1 = (RAW_actual_velocity_1/10);
            let variable_2 = (RAW_actual_velocity_2/10);
            if(variable_1<0){
                variable_1 = -1 * variable_1;
            }
            if(variable_2<0){
                variable_2 = -1 * variable_2;
            }

            if(velocity_counter==0){
                velocity_1_0 = variable_1;
                velocity_2_0 = variable_2;
                Velocity_Actual_1 = variable_1;
                Velocity_Actual_2 = variable_2;
                velocity_counter = velocity_counter + 1;
            }
            else if(velocity_counter==1){
                velocity_1_1 = variable_1;
                velocity_2_1 = variable_2;
                Velocity_Actual_1 = (velocity_1_0 + velocity_1_1)/2;
                Velocity_Actual_2 = (velocity_2_0 + velocity_2_1)/2;
                velocity_counter = velocity_counter + 1;
            }
            else if(velocity_counter==2){
                velocity_1_2 = variable_1;
                velocity_2_2 = variable_2;
                Velocity_Actual_1 = (velocity_1_0+velocity_1_1+velocity_1_2)/3;
                Velocity_Actual_2 = (velocity_2_0+velocity_2_1+velocity_2_2)/3;
                velocity_counter = velocity_counter + 1;
            }
            else if(velocity_counter==3){
                velocity_1_3 = variable_1;
                velocity_2_3 = variable_2;
                Velocity_Actual_1 = (velocity_1_0+velocity_1_1+velocity_1_2+velocity_1_3)/4;
                Velocity_Actual_2 = (velocity_2_0+velocity_2_1+velocity_2_2+velocity_2_3)/4;
                velocity_counter = velocity_counter + 1;
            }
            else if(velocity_counter==4){
                velocity_1_4 = variable_1;
                velocity_2_4 = variable_2;
                Velocity_Actual_1 = (velocity_1_0+velocity_1_1+velocity_1_2+velocity_1_3+velocity_1_4)/5;
                Velocity_Actual_2 = (velocity_2_0+velocity_2_1+velocity_2_2+velocity_2_3+velocity_2_4)/5;
                velocity_counter = velocity_counter + 1;
            }
            else if(velocity_counter==5){
                velocity_1_5 = variable_1;
                velocity_2_5 = variable_2;
                Velocity_Actual_1 = (velocity_1_0+velocity_1_1+velocity_1_2+velocity_1_3+velocity_1_4+velocity_1_5)/6;
                Velocity_Actual_2 = (velocity_2_0+velocity_2_1+velocity_2_2+velocity_2_3+velocity_2_4+velocity_2_5)/6;
                velocity_counter = velocity_counter + 1;
            }
            else if(velocity_counter==6){
                velocity_1_6 = variable_1;
                velocity_2_6 = variable_2;
                Velocity_Actual_1 = (velocity_1_0+velocity_1_1+velocity_1_2+velocity_1_3+velocity_1_4+velocity_1_5+velocity_1_6)/7;
                Velocity_Actual_2 = (velocity_2_0+velocity_2_1+velocity_2_2+velocity_2_3+velocity_2_4+velocity_2_5+velocity_2_6)/7;
                velocity_counter = velocity_counter + 1;
            }
            else if(velocity_counter==7){
                velocity_1_7 = variable_1;
                velocity_2_7 = variable_2;
                Velocity_Actual_1 = (velocity_1_0+velocity_1_1+velocity_1_2+velocity_1_3+velocity_1_4+velocity_1_5+velocity_1_6+velocity_1_7)/8;
                Velocity_Actual_2 = (velocity_2_0+velocity_2_1+velocity_2_2+velocity_2_3+velocity_2_4+velocity_2_5+velocity_2_6+velocity_2_7)/8;
                velocity_counter = velocity_counter + 1;
            }
            else if(velocity_counter==8){
                velocity_1_8 = variable_1;
                velocity_2_8 = variable_2;
                Velocity_Actual_1 = (velocity_1_0+velocity_1_1+velocity_1_2+velocity_1_3+velocity_1_4+velocity_1_5+velocity_1_6+velocity_1_7+velocity_1_8)/9;
                Velocity_Actual_2 = (velocity_2_0+velocity_2_1+velocity_2_2+velocity_2_3+velocity_2_4+velocity_2_5+velocity_2_6+velocity_2_7+velocity_2_8)/9;
                velocity_counter = velocity_counter + 1;
            }
            else if(velocity_counter==9){
                velocity_1_9 = variable_1;
                velocity_2_9 = variable_2;
                Velocity_Actual_1 = (velocity_1_0+velocity_1_1+velocity_1_2+velocity_1_3+velocity_1_4+velocity_1_5+velocity_1_6+velocity_1_7+velocity_1_8+velocity_1_9)/10;
                Velocity_Actual_2 = (velocity_2_0+velocity_2_1+velocity_2_2+velocity_2_3+velocity_2_4+velocity_2_5+velocity_2_6+velocity_2_7+velocity_2_8+velocity_2_9)/10;
                velocity_counter = velocity_counter + 1;
            }
            else{
                velocity_1_0 = velocity_1_1;
                velocity_1_1 = velocity_1_2;
                velocity_1_2 = velocity_1_3;
                velocity_1_3 = velocity_1_4;
                velocity_1_4 = velocity_1_5;
                velocity_1_5 = velocity_1_6;
                velocity_1_6 = velocity_1_7;
                velocity_1_7 = velocity_1_8;
                velocity_1_8 = velocity_1_9;
                velocity_1_9 = variable_1;
                Velocity_Actual_1 = (velocity_1_0+velocity_1_1+velocity_1_2+velocity_1_3+velocity_1_4+velocity_1_5+velocity_1_6+velocity_1_7+velocity_1_8+velocity_1_9)/10;
                velocity_2_0 = velocity_2_1;
                velocity_2_1 = velocity_2_2;
                velocity_2_2 = velocity_2_3;
                velocity_2_3 = velocity_2_4;
                velocity_2_4 = velocity_2_5;
                velocity_2_5 = velocity_2_6;
                velocity_2_6 = velocity_2_7;
                velocity_2_7 = velocity_2_8;
                velocity_2_8 = velocity_2_9;
                velocity_2_9 = variable_2;
                Velocity_Actual_2 = (velocity_2_0+velocity_2_1+velocity_2_2+velocity_2_3+velocity_2_4+velocity_2_5+velocity_2_6+velocity_2_7+velocity_2_8+velocity_2_9)/10;
            }
            Vel_RPM_1 = (Math.round((Velocity_Actual_1/Counts_Per_Rev_1)*60));
            Vel_RPM_2 = (Math.round((Velocity_Actual_2/Counts_Per_Rev_2)*60));
        }

        function Set_V_Loop_Limit_RPM(){
            function cb(dat){
                console.log("Response to Set V-Loop Limit Command: " + dat);
            }
                let vel_1 = parseInt($("#VLoopMaxRPMTextfield").val());
                let vel_2 = vel_1;
                vel_1= ((vel_1/60)*Counts_Per_Rev_1)*10;
                vel_2= ((vel_2/60)*Counts_Per_Rev_2)*10;
                $.getJSON("_cmd", {type: "set", params:[{id:0x3a, value:vel_1}, {id:0x203a, value:vel_2}]}, cb);
        }

        function Clear_Latched_Faults(){
            function cb(dat){
                console.log("Response to Clear Faults Command: " + dat);
            }
                $.getJSON("_cmd", {type: "set", params:[{id:0xa4, value:0xffff}, {id:0x20a4, value:0xffff}]}, cb);
                last_button_pushed = 0;
        }

        function Refresh_Vel_Track_Bar(){
            document.getElementById('myRange').max = V_Loop_Limit_RPM_1;
            INPUT_VEL_TRACKBAR_1 = parseInt($("#myRange").val());
            document.getElementById('VelocityDisplayRPM').value=INPUT_VEL_TRACKBAR_1;
            document.getElementById('LaserOffsetDisplay').value=parseInt($("#rangeOffset").val());
            INPUT_VEL_TRACKBAR_1= ((INPUT_VEL_TRACKBAR_1/60)*Counts_Per_Rev_1)*10;

            //document.getElementById('myRange').max = V_Loop_Limit_RPM_2;
            INPUT_VEL_TRACKBAR_2 = INPUT_VEL_TRACKBAR_1;
            //document.getElementById('VelocityDisplayRPM').value=INPUT_VEL_TRACKBAR_2;
            //INPUT_VEL_TRACKBAR_2 = ((INPUT_VEL_TRACKBAR_2/60)*Counts_Per_Rev_2)*10;


            if (refresh_counter == 0){
                trackbar_compare_1 = INPUT_VEL_TRACKBAR_1;
                refresh_counter = refresh_counter + 1;
            }
            else if (refresh_counter == 1){
                trackbar_compare_2 = INPUT_VEL_TRACKBAR_1;
                refresh_counter = 0;
            }
            if(last_button_pushed==1){
                if(trackbar_compare_1 != trackbar_compare_2){
                    console.log("trackbar compare value 1: "+trackbar_compare_1 + " trackbar compare value 2: "+trackbar_compare_2);
                    Update_Velocity();
                }
            }
        }

        function Get_V_Loop_Limit_RPM(){
            let variable_1 = (RAW_V_Loop_Limit_RPM_1/10);
            V_Loop_Limit_RPM_1 = (Math.round((variable_1/Counts_Per_Rev_1)*60));
            ceiling_1 = Math.ceil(V_Loop_Limit_RPM_1/1000)*1000;
            units_1 = (ceiling_1*0.0625);
/*
            let variable_2 = (RAW_V_Loop_Limit_RPM_2/10);
            V_Loop_Limit_RPM_2 = (Math.round((variable_2/Counts_Per_Rev_2)*60));
            ceiling_2 = Math.ceil(V_Loop_Limit_RPM_2/1000)*1000;
            units_2 = (ceiling_2*0.0625);
*/
            
            Refresh_Vel_Track_Bar();
        }

        function Update_Bus_Voltage(){
            let variable_1 = (RAW_bus_voltage_1/10);
            //console.log("RAW_bus_voltage/10 before round: "+variable_1)
            variable_1 = Math.round(variable_1);
            Bus_Voltage_1 = variable_1.toString();

            let variable_2 = (RAW_bus_voltage_2/10);
            variable_2 = Math.round(variable_2);
            Bus_Voltage_2 = variable_2.toString();
        }
        
        function Update_Motor_Temp(){
            let variable_1 = (RAW_motor_temp_1);
            Temperature_1 = variable_1.toString();

            let variable_2 = (RAW_motor_temp_2);
            Temperature_2 = variable_2.toString();
        }

        function Get_Counts_Per_Rev_Multi_Axis(){
            function cb(dat){
                RAW_counts_per_rev_1 = dat.values[0];
                RAW_counts_per_rev_2 = dat.values[1];
                console.log("Counts Per Rev Axis 1: "+ RAW_counts_per_rev_1);
                console.log("Counts Per Rev Axis 2: "+ RAW_counts_per_rev_2);
                Counts_Per_Rev_1 = RAW_counts_per_rev_1; 
                Counts_Per_Rev_2 = RAW_counts_per_rev_2;
            }
            $.getJSON("_cmd", {type: "get", ids: [0x1062, 0x3062]}, cb);
        }
        
        function setVelocity () {                
            Get_Counts_Per_Rev_Multi_Axis();
            drawVelocity(Temperature_1, Bus_Voltage_1, Vel_RPM_1,Current_Actual_1, ceiling_1, current_gauge_max, Temperature_2, Bus_Voltage_2, Vel_RPM_2,Current_Actual_2, ceiling_1);
        }

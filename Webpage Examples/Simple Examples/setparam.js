// setparam.js

function SetParam()
{
   function cb( dat )
   {
      console.log( "callback" );
      console.log( dat );
      for( let i=0; i<dat.status.length; i++ )
      {
         if( dat.status[i] != 'ok' )
            $("#val"+i).val( dat.status[i] );
      }
   }
   let params = []

   for( let i=0; i<5; i++ ) // takes the 5 input lines from the GUI and formats them correctly
   {
      let pid = $("#pid" + i ).val().trim() // #pid = Parameter_ID input from the GUI
      if( pid.length == 0 )
         break

      let val = $("#val" + i ).val().trim() // The associated value from the GUI

      params.push( {id: pid, value: val} )
   }

   $.getJSON( "_cmd", {type: "set", params: params }, cb );
}

function GetParam()
{
   function cb( dat )
   {
      console.log(dat)
      for( let i=0; i<dat.values.length; i++ )
         $("#val"+i).val( dat.values[i] );
   }

   let ids = []

   for( let i=0; i<5; i++ )
   {
      let pid = $("#pid" + i ).val().trim()
      if( pid.length == 0 )
         break

      ids.push( pid )
   }

   $.getJSON( "_cmd", {type: "get", ids: ids}, cb );
}

function Refresh()
{
   function cb( dat ){ $("#actpos").html( dat.values[0] ); } // updates the actual_position ID textfield with the first data element.
   $.getJSON( "_cmd", {type: "get", ids: [0x17] }, cb ); // gets the actual position and calls the GUI update.
}

function MoveSetup()
{
   setInterval( Refresh, 50 ); // updates GUI every 50 ms

   function cb( dat ) // updates GUI
   {
      $("#vel").val( dat.values[0] );
      $("#acc").val( dat.values[1] );
   }

   $.getJSON( "_cmd", {type: "get", ids: [0xcb, 0xcc]}, cb ); // gets new values to update GUI
}

function Move()
{
   function cb( dat )
   {
      console.log(dat); 
   }

   function start( dat )
   {
      console.log(dat); 
      $.getJSON( "_cmd", {type: "binary", cmd: 0x11, data: 1 }, cb ); // t 1 command
   }

   let P = $("#pos").val(); // assigning P, V, and A to the value properties of the parameter ID's
   let V = $("#vel").val();
   let A = $("#acc").val();

   $.getJSON( "_cmd", {type: "set", params: [{id: 0xc8, value: 0}, {id: 0xca, value: P}, {id: 0xcb, value: V}, {id: 0xcc, value: A}]}, start )
}


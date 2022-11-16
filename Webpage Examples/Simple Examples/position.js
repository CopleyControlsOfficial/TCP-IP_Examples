
let axis_ct = 1;

function PositionSetup()
{
   function cb( dat )
   {
      axis_ct = dat.values[0]
      console.log( axis_ct )
      for( let i=2; i<=axis_ct; i++ )
         $("#posTbl").append( sprintf( '<tr><td>Axis %d</td><td id="pos%d"> 0 </td> <td > <input id="dest%d" value="0"></td> </tr>', i, i-1, i-1 ))

      setInterval( Refresh, 100 );
   }

   // Get the number of axes on the drive.  I'll add additional rows to my position table based on this
   $.getJSON( "_cmd", {type: "get", ids: [0x0120]}, cb );
}

// This function is called periodically to refresh the joystick and result fields in the table
function Refresh()
{
   function cb( dat )
   {
      for( i=0; i<axis_ct; i++ )
         $("#pos"+i).html( dat.values[i] )
   }

   let ids = []
   for( let i=0; i<axis_ct; i++ )
      ids.push( i*0x2000 + 0x17 )
   $.getJSON( "_cmd", {type: "get", ids: ids}, cb );
}

function Move()
{
   let vel = parseInt($("#vel").val()) * 10
   let acc = parseInt($("#acc").val()) * 0.1

   let params = []

   for( let i=0; i<axis_ct; i++ )
   {
      let p = parseInt( $("#dest"+i).val())
      params.push( {id: 0x00ca+i*0x2000, value: p} )
      params.push( {id: 0x00cb+i*0x2000, value: vel} )
      params.push( {id: 0x00cc+i*0x2000, value: acc} )
      params.push( {id: 0x00cd+i*0x2000, value: acc} )
      params.push( {id: 0x00c8+i*0x2000, value: 0} )
   }

   function cb(dat)
   {
      // Start a move on all axes
      $.getJSON( "_cmd", {type: "binary", cmd: 0x11, data: 0xF001 } );
   }

   console.log( params )
   $.getJSON( "_cmd", {type: "set", params: params}, cb );
}

function Abort()
{
   // Abort the move on all axes
   $.getJSON( "_cmd", {type: "binary", cmd: 0x11, data: 0xF000 } );
}

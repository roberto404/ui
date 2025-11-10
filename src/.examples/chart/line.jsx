
import React from 'react';
import moment from 'moment';
import capitalizeFirstLetter from '@1studio/utils/string/capitalizeFirstLetter';

import degToRad from '@1studio/utils/geometry/deg2rad';

/* !- React Elements */

import Resize from '../../resize';
import Coordinate from '../../chart/coordinate';
import LineChart from '../../chart/line';


/* !- Constants */

/**
 * Green Point for second data group
 */
const element = ({ x, y }) => <circle cx={x} cy={y} r="8" fill="green" />;

// const data = {
//   first: [
//     { x: 0, y: 0 },
//     { x: 3, y: 6 },
//     { x: 8, y: 2 },
//   ],
//   second: [
//     { x: 0, y: 5, element },
//     { x: 5, y: 5, element },
//     { x: 7, y: 5, element },
//   ],
// };

const data = [{
  id: 'alpha',
  values: [100, 110, 130, 110, 130, 130],
  xAxis: ['2025-01-02', '2025-03-12', '2025-05-02', '2025-05-12', '2025-10-02'],
}];






/**
 * GridView + Filters + Connect + Paginate
 */
const Example = () => {



  const cos = Math.cos;
  const sin = Math.sin;
  const π = Math.PI;
  // const f_matrix_times = (( [[a,b], [c,d]], [x,y]) => [ a * x + b * y, c * x + d * y]);
  const f_matrix_times = (([[a, b], [c, d]], [x, y]) => [a * x + b * y, c * x + d * y]);
  const f_rotate_matrix = ((x) => {
    const cosx = cos(x);
    const sinx = sin(x);
    return [[cosx, -sinx], [sinx, cosx]];
  });
  // const f_vec_add = (([a1, a2], [b1, b2]) => [a1 + b1, a2 + b2]);
  const f_vec_add = (([a1, a2], [b1, b2]) => [a1 + b1, a2 + b2]);
  const f_svg_ellipse_arc = (([cx, cy], [rx, ry], [t1, Δ], φ) => {
    /* [
returns a a array that represent a ellipse for SVG path element d attribute.
cx,cy → center of ellipse.
rx,ry → major minor radius.
t1 → start angle, in radian.
Δ → angle to sweep, in radian. positive.
φ → rotation on the whole, in radian.
url: SVG Circle Arc http://xahlee.info/js/svg_circle_arc.html
Version 2019-06-19
 ] */
    Δ = Δ % (2 * π);
    const rotMatrix = f_rotate_matrix(φ);
    const [sX, sY] = (f_vec_add(f_matrix_times(rotMatrix, [rx * cos(t1), ry * sin(t1)]), [
      cx,
      cy,
    ]));
    const [eX, eY] = (f_vec_add(f_matrix_times(rotMatrix, [rx * cos(t1 + Δ), ry * sin(t1 + Δ)]), [cx, cy]));
    const fA = ((Δ > π) ? 1 : 0);
    const fS = ((Δ > 0) ? 1 : 0);
    return [" M ", sX, " ", sY, " A ", rx, ry, φ / π * 180, fA, fS, eX, eY];
  });




  console.log(
    f_svg_ellipse_arc(
      [200, 200],
      [100, 100],
      [degToRad(0), degToRad(360)],
      degToRad(0)
    )
  );

  // [' M ', 300, ' ', 200, ' A ', 100, 100, 0, 1, 1, 299.93908270190957, 196.51005032974993]


  return (
    <div>
      {/* <h1>Coordinate</h1>

      <h2>Static coordinate system</h2> */}


      {/* <svg
              viewBox="0 0 100 100"
              width={400}
              height={400}
            >
              <rect x="0" y="0" width="50" height="50" />
            </svg> */}



      <div className="col-1-2" style={{ height: '400px' }}>
        <Resize>
          <LineChart
            data={data}
          />
          {/* <Coordinate
            data={data}
            // xAxisSteps={8}
            // yAxisSteps={6}
            // yAxisLabel={({ i, x, y }) =>
            // (
            //   <text
            //     x={x}
            //     y={y}
            //     alignmentBaseline="middle"
            //     textAnchor="end"
            //   >
            //     {i} -
            //   </text>
            // )}
            margin={{
              top: 70,
              right: 50,
              bottom: 25,
              left: 50,
            }}
          /> */}
        </Resize>
      </div>

    </div>
  )
};

export default Example;

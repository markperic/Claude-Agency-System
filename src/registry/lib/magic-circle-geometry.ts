import { BufferGeometry, BufferAttribute, Sphere, Vector3 } from "three";

/**
 * Geometry for a Pilates magic circle (fitness ring), generated in code —
 * there is no downloadable model of one under a licence we can use, and we
 * don't need one: the band is a tube swept along an ellipse, which is ~40
 * lines of maths and about 8KB of buffers instead of a multi-megabyte GLB.
 *
 * The payoff of generating it is that the shape stays *parametric*, so scroll
 * can squeeze the ring the way a real one squeezes rather than just scaling a
 * frozen mesh. Scaling is the tell: a real magic circle is a closed steel band
 * of fixed length, so pressing the two pads together does not shrink it, it
 * makes it bulge sideways. Hence `minorAxisForPerimeter` below — as the
 * squeezed axis shortens we solve for the other axis that keeps the perimeter
 * constant, and the ring conserves its circumference like the real object.
 */

export const TUBULAR_SEGMENTS = 240;
export const RADIAL_SEGMENTS = 20;

const VERTEX_COUNT = (TUBULAR_SEGMENTS + 1) * (RADIAL_SEGMENTS + 1);

/**
 * Ramanujan's second approximation. An exact ellipse perimeter needs an
 * elliptic integral; this is accurate to ~1e-5 over the eccentricities we
 * ever reach here (the ring never squeezes past about 2:1), which is three
 * orders of magnitude below anything visible at 1000px.
 */
export function ellipsePerimeter(a: number, b: number): number {
  return Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
}

/**
 * Given the squeezed semi-axis `a` and the band's fixed circumference, find
 * the perpendicular semi-axis. Bisection rather than an inversion of the
 * formula above: perimeter is monotonic in `b`, 40 iterations converge well
 * past float precision, and it costs about 2µs — irrelevant next to the
 * vertex loop it feeds.
 */
export function minorAxisForPerimeter(a: number, perimeter: number): number {
  let lo = a;
  let hi = a * 5;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) * 0.5;
    if (ellipsePerimeter(a, mid) < perimeter) lo = mid;
    else hi = mid;
  }
  return (lo + hi) * 0.5;
}

/**
 * Allocates the band once: indices and UVs never change, only positions and
 * normals, so those two are the only buffers `deformBand` touches per frame.
 */
export function createBandGeometry(): BufferGeometry {
  const geometry = new BufferGeometry();

  const positions = new Float32Array(VERTEX_COUNT * 3);
  const normals = new Float32Array(VERTEX_COUNT * 3);
  const uvs = new Float32Array(VERTEX_COUNT * 2);
  const indices: number[] = [];

  for (let i = 0; i <= TUBULAR_SEGMENTS; i++) {
    for (let j = 0; j <= RADIAL_SEGMENTS; j++) {
      const v = i * (RADIAL_SEGMENTS + 1) + j;
      uvs[v * 2] = i / TUBULAR_SEGMENTS;
      uvs[v * 2 + 1] = j / RADIAL_SEGMENTS;
    }
  }

  for (let i = 1; i <= TUBULAR_SEGMENTS; i++) {
    for (let j = 1; j <= RADIAL_SEGMENTS; j++) {
      const a = (RADIAL_SEGMENTS + 1) * i + j - 1;
      const b = (RADIAL_SEGMENTS + 1) * (i - 1) + j - 1;
      const c = (RADIAL_SEGMENTS + 1) * (i - 1) + j;
      const d = (RADIAL_SEGMENTS + 1) * i + j;
      indices.push(a, b, d, b, c, d);
    }
  }

  geometry.setIndex(indices);
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new BufferAttribute(normals, 3));
  geometry.setAttribute("uv", new BufferAttribute(uvs, 2));

  // Set once and left alone. Recomputing it per frame is pure waste when we
  // already know the ring can never exceed its own circumference, and leaving
  // it null makes three fall back to computing it anyway on the first render.
  geometry.boundingSphere = new Sphere(new Vector3(0, 0, 0), 2.5);

  return geometry;
}

/**
 * Rewrites positions and normals for one squeeze state.
 *
 * Centreline is the ellipse C(θ) = (a·cosθ, b·sinθ, 0). At each θ we build a
 * local frame — tangent T from C'(θ), in-plane outward normal N = (T.y, −T.x),
 * binormal B = +Z — and ring the tube around it. Because the curve is planar
 * the frame never twists, so there's no need for a parallel-transport pass;
 * the surface normal is exactly cos(φ)·N + sin(φ)·B.
 *
 * This runs on the CPU rather than in a vertex shader. It's ~5k vertices, so
 * it costs well under a millisecond, and keeping it here means the band still
 * lights and shadows through a stock MeshStandardMaterial instead of needing
 * a hand-written PBR shader or an onBeforeCompile patch.
 */
export function deformBand(
  geometry: BufferGeometry,
  a: number,
  b: number,
  tubeRadius: number,
): void {
  const positionAttribute = geometry.getAttribute("position") as BufferAttribute;
  const normalAttribute = geometry.getAttribute("normal") as BufferAttribute;
  const positions = positionAttribute.array as Float32Array;
  const normals = normalAttribute.array as Float32Array;

  for (let i = 0; i <= TUBULAR_SEGMENTS; i++) {
    const theta = (i / TUBULAR_SEGMENTS) * Math.PI * 2;
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);

    const centreX = a * cosTheta;
    const centreY = b * sinTheta;

    // Tangent, then the in-plane outward normal as its perpendicular.
    const tangentX = -a * sinTheta;
    const tangentY = b * cosTheta;
    const tangentLength = Math.hypot(tangentX, tangentY) || 1;
    const outwardX = (tangentY / tangentLength);
    const outwardY = (-tangentX / tangentLength);

    for (let j = 0; j <= RADIAL_SEGMENTS; j++) {
      const phi = (j / RADIAL_SEGMENTS) * Math.PI * 2;
      const cosPhi = Math.cos(phi);
      const sinPhi = Math.sin(phi);

      const normalX = cosPhi * outwardX;
      const normalY = cosPhi * outwardY;
      const normalZ = sinPhi;

      const v = (i * (RADIAL_SEGMENTS + 1) + j) * 3;
      positions[v] = centreX + tubeRadius * normalX;
      positions[v + 1] = centreY + tubeRadius * normalY;
      positions[v + 2] = tubeRadius * normalZ;

      normals[v] = normalX;
      normals[v + 1] = normalY;
      normals[v + 2] = normalZ;
    }
  }

  positionAttribute.needsUpdate = true;
  normalAttribute.needsUpdate = true;
}

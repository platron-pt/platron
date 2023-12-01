export default function keyPath2obj(path, initial) {
  const output = path.split(".").reduce((object, property) => {
    return object[property];
  }, initial);
  return output;
}

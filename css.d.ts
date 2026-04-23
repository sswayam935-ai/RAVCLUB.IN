declare module "*.css" {
  export {};
}

declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

export default function Header({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  return <header>{children}</header>;
}

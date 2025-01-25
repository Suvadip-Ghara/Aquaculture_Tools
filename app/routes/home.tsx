import { Welcome } from "../welcome/welcome";
import { Helmet } from 'react-helmet';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Aquaculture Tools</title>
        <meta name="description" content="Welcome to Aquaculture Tools!" />
      </Helmet>
      <Welcome />
    </>
  );
}

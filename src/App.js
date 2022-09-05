import CssBaseline from '@mui/material/CssBaseline';
import Layout from 'components/Layout';
import Todos from 'components/Todos';

function App() {
  return (
    <>
      <CssBaseline />
      <Layout>
        <Todos />
      </Layout>
    </>
  );
}

export default App;

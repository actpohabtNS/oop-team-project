import './styles/App.css';
import { Container, Button } from 'react-bootstrap'

function App() {
  return (
    <Container fluid className="p-0 app d-flex flex-column">
      <div className="canvas m-4 mb-0 p-0">

      </div>

      <footer className="toolbar d-flex justify-content-center align-items-center h-100">
        <Button variant="outline-secondary" disabled>
          {'✕ Clear ✕'}
        </Button>
        <Button variant="primary" disabled>
          {'> Next step >'}
        </Button>

        <Button variant="primary" disabled>
          {'⏵ Animate ⏵'}
        </Button>

        <Button variant="primary" disabled>
          {'>> Result >>'}
        </Button>

        <Button variant="outline-primary">
          {'⇋ Randomize ⇋'}
        </Button>
      </footer>
    </Container>
  );
}

export default App;

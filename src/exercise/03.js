// useContext: simple Counter
// http://localhost:3000/isolated/exercise/03.js

import * as React from 'react'

// 🐨 create your CountContext here with React.createContext
const CountContext = React.createContext()

const CountProvider = props => {
  const {children} = props
  const [count, setCount] = React.useState(0)

  return <CountContext.Provider value={[count, setCount]} {...props} />
}

const useCounter = () => {
  const context = React.useContext(CountContext)
  if (!context) {
    throw Error('useCount must be used within a CountProvider.')
  }
  return context
}

function CountDisplay() {
  // 🐨 get the count from useContext with the CountContext
  const [count] = useCounter()
  return <div>{`The current count is ${count}`}</div>
}

function Counter() {
  // 🐨 get the setCount from useContext with the CountContext

  const [count, setCount] = useCounter()
  const increment = () => setCount(c => c + 1)
  return <button onClick={increment}>Increment count</button>
}

function App() {
  return (
    <div>
      <CountProvider>
        <CountDisplay />
        <Counter />
      </CountProvider>
    </div>
  )
}

export default App

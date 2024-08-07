import Navbar from './Navbar';
import Product  from "../Product/Product";
import { useAuth } from "../../context/isAuthContext";

const SearchBox = () => {
  return (
    <div className="searchBox">
      {/* <SearchIcon /> */}
      <input type="text" placeholder="Search product" />
    </div>
  );
}

const Categories = () => {
  return (
    <div className="categories">
      <span className="active">All</span>
      <span>Clothes</span>
      <span>Electronics</span>
      <span>Furniture</span>
      <span>Toys</span>
    </div>
  )
}


function App() {
  const auth = useAuth()

  const logoutComponent = () => {
    auth.logout()
    
  }

  return (
    <>
      <Navbar />

      <main>        
        <section className="main">



          <div className="productList">
            <Product />
            <Product />
            <Product />
            <Product />
            <Product />
            <Product />
          </div>
        </section>


        
        <button type='button' onClick={logoutComponent} > Cerrar sesion</button>

      

      </main>
    </>
  )
}

export default App

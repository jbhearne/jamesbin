//imports
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectVendors, fetchVendors } from "./vendorsSlice";
import Vendor from "./vendor/Vendor";
import "./vendors.css"

//Component that renders a list of Vendore
function Vendors() {

  //Redux constant 
  const dispatch = useDispatch();
  const vendors = useSelector(selectVendors);
  
  //Fetches all vendors 
  useEffect(() => {
    dispatch(fetchVendors());
  }, []);

  //Renders a list of vendors
  return (
    <div className="main-vendors">
      <h2>Our Vendors</h2>
      {vendors.map(vendor => {
        return (
          <div key={vendor.id} className="vendor">
           <Vendor key={vendor.id} vendor={vendor} />
          </div>
        )
      })}
    </div>
  )
}

export default Vendors;
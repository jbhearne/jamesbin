import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectVendors, fetchVendors } from "./vendorsSlice";
import Vendor from "./vendor/Vendor";
import "./vendors.css"

function Vendors() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchVendors());
  }, []);

  const vendors = useSelector(selectVendors);

  return (
    <div className="main-vendors">
      <h2>Our Vendors</h2>
      {vendors.map(vendor => {
        return (
          <div>
           <Vendor key={vendor.id} vendor={vendor} />
          </div>
        )
      })}
    </div>
  )
}

export default Vendors;
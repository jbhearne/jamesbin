import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectVendors, fetchVendors } from "./vendorsSlice";
import Vendor from "./vendor/Vendor";

function Vendors() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchVendors());
  }, []);

  const vendors = useSelector(selectVendors);

  return (
    <div>
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
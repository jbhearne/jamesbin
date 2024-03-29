
//Component that renders the info of an individual Vendor
function Vendor({ vendor }) {
  //props: vendor contains the data to be rendered

  //Renders vendor info
  return (
    <div>
      <h3>{vendor.name}</h3>
      <p>{vendor.description}</p>
      <address>
        <span>{vendor.contact.address}</span><br />
        <span>{vendor.contact.city}</span>, <span>{vendor.contact.state}</span> <span>{vendor.contact.zip}</span><br />
        <span>{vendor.contact.email}</span> | <span>{vendor.contact.phone}</span><br />
      </address>
    </div>
  )
}

export default Vendor;
# Address

The address component is a generic component that is useful in any instance where an address field is required and must be stored.

[//]: # '<iframe width="100%" height="500" src="https://pd-docs-adminportal-test.shesha.dev/shesha/forms-designer/?id=d1a61bc8-6960-4426-9e00-b0637f39d8b1" title="Address Component" ></iframe>'

In the above example, the address component was configured with a name of `address`. Two text fields were dragged into the form. The text fields were named `lat` and `lng` respectively and displayed the data as a user selected the relevant address.

It is important to note that in order for this to happen, a script/instruction was inserted in the On Select event which instructed the `lat` and `lng` fields to be populated once the data is retrieved from the external map service.

`
setFormData({
  values: {
    address: event.address,
    lat: event.lat,
    lng: event.lng
  },
  mergeValues: true
})`

## Properties

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](/docs/front-end-basics/form-components/common-component-properties).

### Min Characters Before Search

- The minimum number of characters needed before the search can begin.

### Debounce (MS)

- Debouncing prevents extra activations/inputs from triggering too often. This is the time in milliseconds the call will be delayed by.

### Google Maps Key

- An API key for authorization. The Google Maps key which is required to make successful calls to Google services.

### Open Cage Key

- An API key for authorization. The OpenCage key which is required to make successful calls to OpenCage services.

### Country Restriction (Area restriction)

- A filter which will only allow searches that fall within the country/countries selected. Multiple countries can be selected.

### Prefix (Area restriction)

- A simple prefix which is appended in the search but not the input search field, often used to create a biased search in address.

```

```

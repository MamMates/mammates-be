import { Client } from '@googlemaps/google-maps-services-js';

const parseAddress = async (address) => {
  const client = new Client();
  const args = {
    params: {
      key: process.env.MAPS_KEY,
      address,
    },
  };

  const result = client.geocode(args)
    .then((gcResponse) => gcResponse.data.results[0])
    .then((res) => {
      const parsedAddress = {
        line: '',
        subdistrict: '',
        city: '',
        province: '',
      };

      if (res === undefined) {
        return false;
      }

      const components = res.address_components;
      components.forEach((componen) => {
        if (
          componen.types.includes('street_number')
          || componen.types.includes('route')
          || componen.types.includes('locality')
          || componen.types.includes('administrative_area_level_4')) {
          parsedAddress.line += parsedAddress.line === '' ? componen.long_name : `, ${componen.long_name}`;
        }

        if (componen.types.includes('administrative_area_level_3')) {
          parsedAddress.subdistrict = componen.long_name;
        }

        if (componen.types.includes('administrative_area_level_2')) {
          parsedAddress.city = componen.long_name;
        }

        if (componen.types.includes('administrative_area_level_1')) {
          parsedAddress.province = componen.long_name;
        }
      });

      return parsedAddress;
    });

  return result;
};

export default parseAddress;

import React from "react";
import { gql, type TypedDocumentNode } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

type LocationsQuery = {
  locations: Array<{
    id: string;
    name: string;
    description: string;
    photo: string;
  }>;
};

export const GET_LOCATIONS_QUERY: TypedDocumentNode<LocationsQuery> = gql`
  query GetLocations {
    locations {
      id
      name
      description
      photo
    }
  }
`;

export function DisplayLocations() {
  const { loading, error, data } = useQuery(GET_LOCATIONS_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return data?.locations.map(({ id, name, description, photo }: any) => (
    <div key={id}>
      <h3>{name}</h3>
      <img width="400" height="250" alt="location-reference" src={`${photo}`} />
      <br />
      <b>About this location:</b>
      <p>{description}</p>
      <br />
    </div>
  ));
}

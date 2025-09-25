import React from "react";
import { gql, type TypedDocumentNode } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

type LocationsQuery = {
  location: {
    id: string;
    name: string;
    description: string;
    photo: string;
  };
};
type LocationQueryVariables = {
  locationId: number;
};

export const GET_LOCATION_QUERY: TypedDocumentNode<
  LocationsQuery,
  LocationQueryVariables
> = gql`
  query GetLocation($locationId: Int!) {
    location(id: $locationId) {
      id
      name
      description
      photo
    }
  }
`;

export function DisplayLocation({ locationId }: { locationId: number }) {
  const { loading, error, data } = useQuery(GET_LOCATION_QUERY, {
    variables: { locationId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  const {
    location: { name, description, photo } = {
      name: undefined,
      description: undefined,
      photo: undefined,
    },
  } = data ?? {};

  return (
    <div>
      <h3>{name}</h3>
      <img width="400" height="250" alt="location-reference" src={`${photo}`} />
      <br />
      <b>About this location:</b>
      <p>{description}</p>
      <br />
    </div>
  );
}

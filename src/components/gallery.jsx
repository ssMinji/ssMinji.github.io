import React from "react";
import ImageGallery from "react-image-gallery";
import { Divider } from "antd";
import styled from "styled-components";

import GalleryPhoto1 from "../assets/gallery1_pre.jpg";
import GalleryPhoto2 from "../assets/gallery2.jpg";
import GalleryPhoto3_1 from "../assets/gallery3_1.jpg";
import GalleryPhoto3 from "../assets/gallery3.jpg";
import GalleryPhoto4 from "../assets/gallery4.jpg";
import GalleryPhoto5 from "../assets/gallery5.jpg";
import GalleryPhoto6 from "../assets/gallery6.jpg";
import GalleryPhoto7 from "../assets/gallery7.jpg";
import GalleryPhoto8 from "../assets/gallery8.jpg";
import GalleryPhoto9 from "../assets/gallery9.jpg";
import GalleryPhoto10 from "../assets/gallery10.jpg";
import GalleryPhoto11 from "../assets/gallery11.jpg";
import GalleryPhoto12 from "../assets/gallery12.jpg";
import GalleryPhoto13 from "../assets/gallery13.jpg";

const Wrapper = styled.div`
  padding-top: 42px;
  width: 70%;
  margin: 0 auto;
`;

const Title = styled.p`
  font-size: 1rem;
  color: var(--title-color);
  font-weight: bold;
  opacity: 0.85;
  margin-bottom: 0;
  text-align: center;
`;

const images = [
  {
    original: GalleryPhoto1,
    thumbnail: GalleryPhoto1,
  },
  {
    original: GalleryPhoto2,
    thumbnail: GalleryPhoto2,
  },
  {
    original: GalleryPhoto3_1,
    thumbnail: GalleryPhoto3_1,
  },
  {
    original: GalleryPhoto3,
    thumbnail: GalleryPhoto3,
  },
  {
    original: GalleryPhoto4,
    thumbnail: GalleryPhoto4,
  },
  {
    original: GalleryPhoto5,
    thumbnail: GalleryPhoto5,
  },
  {
    original: GalleryPhoto6,
    thumbnail: GalleryPhoto6,
  },
  {
    original: GalleryPhoto7,
    thumbnail: GalleryPhoto7,
  },
  {
    original: GalleryPhoto8,
    thumbnail: GalleryPhoto8,
  },
  {
    original: GalleryPhoto9,
    thumbnail: GalleryPhoto9,
  },
  {
    original: GalleryPhoto10,
    thumbnail: GalleryPhoto10,
  },
  {
    original: GalleryPhoto11,
    thumbnail: GalleryPhoto11,
  },
  {
    original: GalleryPhoto12,
    thumbnail: GalleryPhoto12,
  },
  {
    original: GalleryPhoto13,
    thumbnail: GalleryPhoto13,
  },
];

const Gallery = () => {
  return (
    <Wrapper>
      <Divider style={{ marginTop: 0, marginBottom: 32 }} plain>
        <Title>우리의 아름다운 순간</Title>
      </Divider>
      <ImageGallery
        showPlayButton={true}
        showFullscreenButton={true}
        items={images}
      />
    </Wrapper>
  );
};

export default Gallery;

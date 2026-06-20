import { Navbar } from '@/components/common/Navbar'
import { FeaturedPlaylist } from '@/components/web-components/FeaturedPlaylist'
import { PopularArtists } from '@/components/web-components/popular-artists'
import { PopularSongs } from '@/components/web-components/popular-songs'
import { PopularAlbum } from '@/components/web-components/PopularAlbum'
import { Recommended } from '@/components/web-components/Recommended'
import React from 'react'

const page = () => {
  return (
    <div className='min-h-full rounded-[12px] bg-[#FFFFFF1A]'>
     <PopularSongs/>
     <FeaturedPlaylist/>
     <PopularArtists/>
     <Recommended/>
     <PopularAlbum/>
    </div>
  )
}

export default page

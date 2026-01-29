const clients = [
  { name: "Google", logo: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" },
  { name: "Microsoft", logo: "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31" },
  { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/200px-Amazon_logo.svg.png" },
  { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/200px-Meta_Platforms_Inc._logo.svg.png" },
  { name: "Apple", logo: "https://www.apple.com/ac/globalnav/7/en_US/images/be15095f-5a20-57d0-ad14-cf4c638e223a/globalnav_apple_image__b5er5ngrzxqq_large.svg" },
  { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/200px-Netflix_2015_logo.svg.png" },
  { name: "Spotify", logo: "https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green.png" },
  { name: "Slack", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/100px-Slack_icon_2019.svg.png" },
];

const ClientLogo = ({ name, logo }: { name: string; logo: string }) => (
  <div 
    className="flex items-center justify-center w-32 h-16 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
    title={name}
  >
    <img 
      src={logo} 
      alt={name}
      className="max-w-full max-h-full object-contain"
    />
  </div>
);

const ClientCarousel = () => {
  return (
    <section className="py-16 border-t border-border overflow-hidden">
      <div className="container mb-8">
        <p className="text-xs text-muted-foreground tracking-widest text-center font-mono">
          Trusted by businesses nationwide
        </p>
      </div>
      
      {/* Infinite scroll container */}
      <div className="relative">
        <div className="flex animate-scroll-left items-center">
          {/* First set */}
          {clients.map((client, index) => (
            <div
              key={`first-${index}`}
              className="flex-shrink-0 px-8 md:px-12"
            >
              <ClientLogo name={client.name} logo={client.logo} />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {clients.map((client, index) => (
            <div
              key={`second-${index}`}
              className="flex-shrink-0 px-8 md:px-12"
            >
              <ClientLogo name={client.name} logo={client.logo} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientCarousel;

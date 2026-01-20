import { useEffect, useState } from 'react';

const DynamicFavicon = () => {
  const [settings, setSettings] = useState({
    favIcon: null,
    websiteName: null,
    websiteDescription: null
  });

  useEffect(() => {
    const storedSettings = localStorage.getItem("settings");
    if (storedSettings) {
      const parsedSettings = JSON.parse(storedSettings);
      setSettings({
        favIcon: parsedSettings?.favIcon || null,
        websiteName: parsedSettings?.websiteName || "Mudeem Admin Panel",
        websiteDescription: parsedSettings?.websiteDescription || "Mudeem Admin Panel"
      });
    }
  }, []);

  useEffect(() => {
    if (settings.favIcon) {
      let link = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'shortcut icon';
        document.head.appendChild(link);
      }
      link.type = 'image/x-icon';
      link.href = settings.favIcon;
    }

    if (settings.websiteName) {
      document.title = settings.websiteName;
    }

    if (settings.websiteDescription) {
      let metaDescription = document.querySelector("meta[name='description']");
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
      }
      metaDescription.content = settings.websiteDescription;
    }
  }, [settings]);

  return null;
};

export default DynamicFavicon;

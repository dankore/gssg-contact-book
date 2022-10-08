exports.metatags = ({ page, data }) => {
  const title = 'GSS Gwarinpa Contact Book 📗';
  const url = data ? data.photo : 'https://gss-gwarinpa.s3.us-east-2.amazonaws.com/1580629627915';
  const page_cap = `${page.charAt(0).toUpperCase() + page.slice(1)}`;

  const seo = {
    '/': {
      title,
      description: 'Find Your GSS Gwarinpa Classmates and Their Contacts.',
      image: {
        url,
        alt: `Homepage image for ${title}`,
      },
      path: '',
    },
    about: {
      title: `${page_cap} | ${title}`,
      description: 'We are a group of current and past students who have come together to create a space where you can connect with one another, find new friends, discover new opportunities for adventure, and communicate with your fellow alumni.',
      image: {
        url,
        alt: 'A man presenting an award to a student',
      },
      path: `${page}`,
    },
    contacts: {
      title: `${page_cap} | ${title}`,
      description: 'Contacts for GSS Gwarinpa students. Discover Present & Past GSS Gwarinpa Students.',
      image: {
        url,
        alt: '',
      },
      path: `${page}`,
    },
    contact: {
      title: `${data?.firstName} ${data?.lastName} | ${title}`,
      description: `${data?.firstName} ${data?.lastName}'s contact page.`,
      image: {
        url,
        alt: `${data?.firstName} ${data?.lastName}'s photo.`,
      },
      path: `contacts/${data?.username}`,
    },
  };

  if (seo[page]) return seo[page];
  else return seo['/'];
};

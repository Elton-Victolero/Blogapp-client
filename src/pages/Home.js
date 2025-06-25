import Banner from '../components/Banner';
import HotBlogs from '../components/HotBlogs';
import BlogList from '../components/BlogList';

export default function Home() {
  const data = {
    title: "blogpost.com",
    content: "This Blog website is accessible to all. Post articles to your heart's content",
    destination: "/post",
    buttonLabel: "CREATE BLOG"
  };

  return (
    <>
      <Banner data={data} />

      <div className="container mt-4">
        <div className="row">
          <div className="col-md-4">
            <HotBlogs />
          </div>
          <div className="col-md-8">
            <h4 className="mb-3"><b>LATEST BLOGS</b></h4>
            <BlogList />
          </div>
        </div>
      </div>
    </>
  );
}

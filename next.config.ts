module.exports = {
  async redirects() {
    return [{ source: '/', destination: '/fitness/main', permanent: true, }];
  },
};

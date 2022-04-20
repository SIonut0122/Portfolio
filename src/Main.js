import './css/Main.css';
import React from 'react';
import FirstPage from './comp/firstPage.js'
import SecondPage from './comp/secondPage.js'
import ThirdPage from './comp/thirdPage.js'
import FourthPage from './comp/fourthPage.js'



class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mainContainer: true,
      projectsContainer: false,
      aboutContainer: false,
      contactContainer: false,
      displayCont: false,
      displayLoading: true
    }
  }
 
componentDidMount() {  
  	// Handle / detect focus outline on mouse / keyboard
    document.body.addEventListener('mousedown', function() {
      document.body.classList.add('using-mouse');
    });
    document.body.addEventListener('keydown', function() {
      document.body.classList.remove('using-mouse');
    });

    // Transitions for loading cont
    setTimeout(() => {
      // Hide dot from i letter
      document.querySelector('.mcwlog_fdot').style.opacity = '0';
    }, 1700);
    setTimeout(() => {
      // Decrease opacity for loading page
      document.querySelector('.main_c_loadingwrap').style.opacity = '0';
      // Render all components and hide unmount loading container
      setTimeout(() => {
        this.setState({ displayLoading: false, displayCont: true })
      }, 300);
    }, 2500);
}


 

  render() {

    return (
        <div>
            {this.state.displayLoading && ( 
              <div className='main_c_loadingwrap'>
              <div className='mclrwplog_cont'>
                <div className='mclrwplog_wrap'>
                    <div className='mclrwplog_wrins'>
                      <div className='mcwlog_wrins_wraptxt'>
                        <div>s</div>
                        <div>i<span className='mcwlog_fdot'>&bull;</span></div>
                      </div>
                    </div>
                </div>
              </div>
            </div> 
            )}

            {this.state.displayCont && (
              <div className='main_container' id='ins_main_c'>
                <div className='inside_main_cont'>
                  {this.state.mainContainer && (
                    <FirstPage/>
                  )}
                  
                    {/* Navigation left menu */}
                    <div className='left_navmenu' tabIndex='0' role='navigation'>
                      <a href='#' className='lf_nm_logo'><span>s</span>i</a>
                      <div className='lf_nm_wrapnavmenu'>
                        <span className='lf_nmwm_link' data-text='Contact' tabIndex='0' role='contact'><span>Contact</span></span>
                        <span className='lf_nmwm_link' data-text='Projects' tabIndex='0' role='projects'><span>Projects</span></span>
                        <span className='lf_nmwm_link' data-text='About' tabIndex='0' role='about'><span>About</span></span>
                        <span className='lf_nmwm_link' data-text='Home' tabIndex='0' role='home'><span>Home</span></span>
                      </div>
                    </div>
                      
                    <div className='sec_page_wrcont'><SecondPage/></div>
                    <ThirdPage/>
                    <FourthPage/>
                </div>
              </div> 
            )}         
        </div>
      )
  }
}


export default Main;
 
#version 330 core

uniform vec2 iResolution;               /* screen resolution, value passed from CPU */
uniform float iTime;                    /* current time, value passed from CPU */
uniform int iFrame;                     /* current frame, value passed from CPU */
in vec2 fragCoord;                      /* fragment shader input: fragment coordinates, valued passed from vertex shader */
out vec4 fragColor;                     /* fragment shader output: fragment color, value passed to pixel processing for screen display */

const float M_PI = 3.1415926535;                        /* const value for PI */
const vec3 BG_COLOR = vec3(3, 16, 26) / 255.;       /* const value for background color */
const float ERID_R = 230;

//// This function converts from Polar Coordinates to Cartesian coordinates

vec2 polar2cart(float angle, float length)
{
    return vec2(cos(angle) * length, sin(angle) * length);
}

// random variable function found online
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

//// This is a sample function showing you how to check if a point is inside a triangle

bool inTriangle(vec2 p, vec2 p1, vec2 p2, vec2 p3)
{
    if(dot(cross(vec3(p2 - p1, 0), vec3(p - p1, 0)), cross(vec3(p2 - p1, 0), vec3(p3 - p1, 0))) >= 0. &&
        dot(cross(vec3(p3 - p2, 0), vec3(p - p2, 0)), cross(vec3(p3 - p2, 0), vec3(p1 - p2, 0))) >= 0. &&
        dot(cross(vec3(p1 - p3, 0), vec3(p - p3, 0)), cross(vec3(p1 - p3, 0), vec3(p2 - p3, 0))) >= 0.){
        return true;
    }
    return false;
}

//// This is a sample function showing you how to draw a rotated triangle 
//// Time is specified with iTime

vec3 drawTriangle(vec2 pos, vec2 center, vec3 color)
{
    vec2 p1 = polar2cart(iTime * 2, 160.) + center;
    vec2 p2 = polar2cart(iTime * 2 + 2. * M_PI / 3., 160.) + center;
    vec2 p3 = polar2cart(iTime * 2 + 4. * M_PI / 3., 160.) + center;
    if(inTriangle(pos, p1, p2, p3)){
        return color;
    }
    return vec3(0);
}


/////////////////////////////////////////////////////
//// Step 1 Function: Inside Circle
//// In this function, you will implement a function to checks if a point is inside a circle
//// The inputs include the point position, the circle's center and radius
//// The output is a bool indicating if the point is inside the circle (true) or not (false)
/////////////////////////////////////////////////////
//// Implementation hint: use dot(v,v) to calculate the squared length of a vector v
/////////////////////////////////////////////////////

bool inCircle(vec2 pos, vec2 center, float radius)
{
    /* your implementation starts */
    vec2 v = pos - center;

    if (dot(v,v) <= radius * radius) {
        return true;
    }
    /* your implementation ends */
    
    return false;
}

//// This function calls the inCircle function you implemented above and returns the color of the circle
//// If the point is outside the circle, it returns a zero vector by default
vec3 drawCircle(vec2 pos, vec2 center, float radius, vec3 color)
{
    if(inCircle(pos, center, radius)){
        return color;
    }
    return vec3(0);
}

vec4 drawRings(vec2 pos, vec2 center, float radius, vec3 color, float thickness) {
    
    float angle = radians(-75);

    vec2 v = pos - center;
    // tilt the rings
    v = vec2(v.x * cos(angle) - v.y * sin(angle), v.x * cos(angle) + v.y * sin(angle));
    // make it an ellipse
    v = v / vec2(1.35 * radius, radius / 2);

    float sqrV = dot(v,v);    

    if (sqrV >= 1 - thickness && sqrV <= 1 + thickness) {
        if (inCircle(pos, center, ERID_R) && pos.y > center.y) {
            return vec4(0);
        }

        return vec4(color, 1 - (abs(sqrV - 1) / thickness));
    } 

    return vec4(0); // return 0 vector if not a part of ring
}

/////////////////////////////////////////////////////
//// Step 2 Function: Inside Rectangle
//// In this function, you will implement a function to checks if a point is inside a rectangle
//// The inputs include the point position, the left bottom corner and the right top corner of the rectangle
//// The output is a bool indicating if the point is inside the rectangle (true) or not (false)
/////////////////////////////////////////////////////
//// Implementation hint: use .x and .y to access the x and y components of a vec2 variable
/////////////////////////////////////////////////////

bool inRectangle(vec2 pos, vec2 leftBottom, vec2 rightTop)
{
    /* your implementation starts */
    if (pos.x >= leftBottom.x && pos.x <= rightTop.x &&
        pos.y >= leftBottom.y && pos.y <= rightTop.y) {
            return true;
        }
	
    /* your implementation ends */
    
    return false;
}

//// This function calls the inRectangle function you implemented above and returns the color of the rectangle
//// If the point is outside the rectangle, it returns a zero vector by default

vec3 drawRectangle(vec2 pos, vec2 leftBottom, vec2 rightTop, vec3 color)
{
    if(inRectangle(pos,leftBottom,rightTop)){
        return color;
    }
    return vec3(0);
}


//// This function draws objects on the canvas by specifying a fragColor for each fragCoord

void mainImage(in vec2 fragCoord, out vec4 fragColor)
{
    
    //// Get the window center
    vec2 center = vec2(iResolution / 2.);
    vec2 starBlock = vec2(iResolution.x / 30, iResolution.y);
    vec4 fragOutput;

    // //// By default we draw an animated triangle 
    // vec3 fragOutput = drawTriangle(fragCoord, center, vec3(1.0));
    
    // //// Step 1: Uncomment this line to draw a circle
    // fragOutput = drawCircle(fragCoord, center, 250, vec3(1.0));

    
    // //// Step 2: Uncomment this line to draw a rectangle 
    // fragOutput = drawRectangle(fragCoord, center - vec2(500, 50), center + vec2(500, 50), vec3(1.0));


    // //// Step 3: Uncomment this line to draw an animated circle with a temporally varying radius controlled by a sine function
    // fragOutput = drawCircle(fragCoord, center, 150 + 50. * sin(iTime * 10), vec3(1.0));

    // //// Step 4: Uncomment this line to draw a union of the rectangle and the animated circle you have drawn previously
    // fragOutput = drawRectangle(fragCoord, center - vec2(500, 50), center + vec2(500, 50), vec3(1.0, 0.0, 1.0)) + drawCircle(fragCoord, center, 150 + 50. * sin(iTime * 10), vec3(1.0));

    // stars
    for (int i = 1; i <= 30; i++) {
        vec2 starCenter = starBlock * vec2(i, random(starBlock * vec2(i, 0.6)));

        vec3 star = drawCircle(fragCoord, starCenter, 3 + 1.5 * sin(iTime * 30 + (10 * (i % 2))), vec3(1));
        if (star != vec3(0)) fragOutput = vec4(star, 1.0);
    }

    // draw erid
    vec3 erid = drawCircle(fragCoord, center, ERID_R, vec3(95, 168, 211) / 255);
    if (erid != vec3(0)) fragOutput = vec4(erid, 1.0);

    vec4 ring1 = drawRings(fragCoord, center, ERID_R * 0.8, vec3(202, 233, 255) / 255., 0.4);
    fragOutput.rgb += ring1.rgb * ring1.a;

    vec4 ring2 = drawRings(fragCoord, center, ERID_R, vec3(27, 73, 101) / 255., 0.4);
    fragOutput.rgb += ring2.rgb * ring2.a;

    vec4 ring3 = drawRings(fragCoord, center, ERID_R * 0.6, vec3(98, 182, 203) / 255., 0.2);
    fragOutput.rgb += ring3.rgb * ring3.a;

    vec4 ring4 = drawRings(fragCoord, center, ERID_R * 0.7, vec3(190, 233, 232) / 255., 0.2);
    fragOutput.rgb += ring4.rgb * ring4.a;


    //// Set the fragment color to be the background color if it is zero
    if(fragOutput == vec4(0)){
        fragColor = vec4(BG_COLOR, 1.0);
    }
    //// Otherwise set the fragment color to be the color calculated in fragOutput
    else{
        fragColor = fragOutput;
    }

    //// Step 5: Implement your customized scene by modifying the mainImage function
    //// Try to leverage what you have learned from Step 1 to 4 to define the shape and color of a new object in the fragment shader
    //// Notice how we put multiple objects together by adding their color values
}

void main()
{
    mainImage(fragCoord, fragColor);
}
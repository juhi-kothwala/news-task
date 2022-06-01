import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'; // For Apply Class 
import './App.css';
import { Row, Col, Container, Card, Button, Modal, Badge } from 'react-bootstrap'; // using component 
import { WithContext as ReactTags } from 'react-tag-input'; // Multipal Tag input 
import { useForm } from "react-hook-form"; // Form Validation

function App() {
    const [itemsOptions, setItemsOptions] = useState([]);
    const [show, setShow] = useState(false);
    const [tagState, setTagState] = useState();
    const [setDescription, setSetDescription] = useState();
    const [searchValue, setSearchValue] = useState("");
    const handleClose = () => setShow(false); // model close
    const handleShow = () => setShow(true); // model open
    const { register, setValue, reset, handleSubmit, watch, formState: { errors } } = useForm();// validation
    //  Submit Data 
    const onSubmit = data => {
        setItemsOptions([...itemsOptions, data]);
        reset();
        setSetDescription();
        setTags([]);
        setShow(false);

    }
    // Start For Tags 
    const KeyCodes = {
        comma: 188,
        enter: 13,
    };

    const delimiters = [KeyCodes.comma, KeyCodes.enter];
    const [tags, setTags] = useState([]);

    const handleDelete = (i) => {
        setTags(tags.filter((tag, index) => index !== i));
    };
    const handleAddition = (tag) => {
        setTags([...tags, tag]);
        setValue('tags', tags)
        setTagState(tags)
    };

    const handleDrag = (tag, currPos, newPos) => {
        const newTags = tags.slice();
        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);
        // re-render
        setTags(newTags);
    };

    const handleTagClick = (index) => {
        console.log('The tag at index ' + index + ' was clicked');
    };

    // End For Tags 

    useEffect(() => {
        const data = [
            {
                "title": "This is title 1",
                "description": "The overall level of sentiment was the second-lowest seen for two years, with panellists generally expecting growth prospects to be harmed by acute price pressures.",
                "identifier": "this-is-title",
                "tags": [
                    { id: '1', text: 'small Dogs' },
                    { id: '2', text: 'Black Dogs' },
                ],
            },
            {
                "title": "India's May factory activity remained strong despite inflation worries",
                "description": "India's factory activity expanded at a better-than-expected pace last month as overall demand remained resilient despite persistently high inflation, encouraging firms to hire at the fastest rate since January 2020, according to a private survey.",
                "identifier": "indias-may-factory-activity-remained-strong-despite-inflation-worries",
                "tags": [
                    { id: '1', text: 'Dogs' },
                    { id: '2', text: 'Dogs Food' },
                ],
            },
        ]
        setItemsOptions(data) // set Defalut Data
    }, []);
    const handleChangeDescription = (e) => {
        setValue('description', e.target.value)
        setSetDescription(e.target.value)
    }
    const handleChangeTitle = (e) => {
        let identifier = e.target.value
        let result = identifier.replace(/ /g, "-");
        result = result.replace(/[0-9]/g, '');
        result = result.replace(/[&\/\\#,+()$@~%.'":*?<>{}]/g, '');
        setValue('identifier', result.toLowerCase())
    }
    const searchData = (e) => {
        let searchText = e.target.value
        setSearchValue(searchText);
    }

    let filtredData = itemsOptions;
    if (searchValue) {
        filtredData = itemsOptions.filter((val, index) => {
            if (val.description.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 || val.title.toLowerCase().indexOf(searchValue.toLowerCase()) > -1) {
                return true;
            }

            const tags = val.tags;
            let isFound = false;
            for (let i = 0; i < tags.length; i++) {
                const tag = tags[i];
                if (tag.text.toLowerCase().indexOf(searchValue.toLowerCase()) > -1) {
                    isFound = true;
                    break;
                }
            }

            return isFound;
        })
    }
    return (
        <>
            <div className="search-container">
                <Container>
                    <Row >
                        <Col md="12">
                            <div className="search-news">
                                <input type="text" placeholder="Search News" class="form-control me-3" onKeyUpCapture={searchData} />
                                <Button variant="primary" onClick={handleShow} className="add-news">Add News</Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Container >
                <Modal show={show} onHide={handleClose}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add News</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row className="m-1">
                                <Col sm={2}>
                                    Title
                                </Col>
                                <Col sm={10}>
                                    <input className="form-control" type="text" id="title" name="title" {...register("title", { required: true })} onChange={handleChangeTitle} />
                                    <span className="errorMsg">
                                        {errors.title && "Title is required"}
                                    </span>

                                </Col>
                            </Row>
                            <Row className="m-1">
                                <Col sm={2}>
                                    Description
                                </Col>
                                <Col sm={10}>
                                    <textarea className="form-control" id="description-textarea" name="description-textarea" value={setDescription} onChange={(e) => handleChangeDescription(e)}>
                                    </textarea>

                                    <input type="hidden" id="description" name="description" {...register("description", { required: true })} value={setDescription} />
                                    <span className="errorMsg">
                                        {errors.description && "Description is required"}
                                    </span>
                                </Col>
                            </Row>
                            <Row className="m-1">
                                <Col sm={2}>
                                    Identifier
                                </Col>
                                <Col sm={10}>
                                    <input className="form-control" type="text" id="identifier" name="identifier" readOnly={true} {...register("identifier", { required: true })} />
                                    <span className="errorMsg">
                                        {errors.identifier && "Identifier is required"}
                                    </span>
                                </Col>
                            </Row>
                            <Row className="m-1">
                                <Col sm={2}>
                                    Tags
                                </Col>
                                <Col sm={10}>
                                    <ReactTags
                                        className="form-control"
                                        tags={tags}
                                        delimiters={delimiters}
                                        handleDelete={handleDelete}
                                        handleAddition={handleAddition}
                                        handleDrag={handleDrag}
                                        handleTagClick={handleTagClick}
                                        inputFieldPosition="bottom"
                                        autocomplete
                                        editable
                                    />
                                    <input type="hidden" value={tags} id="tags" name="tags" {...register("tags", { required: true })} />
                                    <span className="errorMsg">
                                        {errors.tags && "Tags is required"}
                                    </span>
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" type="submit">
                                Save
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal>
                <div className="py-5">
                    <Row>
                        {
                            filtredData.map((item, i) => {
                                return <Col md="4" key={i}>
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>{item.title.substring(0, 40)}</Card.Title>
                                            <Card.Text>
                                                <p>
                                                    {item.description.substring(0, 100)}
                                                </p>
                                                <div className="">
                                                    Tags :
                                                    {item.tags.map((item, index) => (
                                                        <Badge bg="#000" className="ms-1 theme-color-bg" key={index.text} pill >{item.text}</Badge>
                                                    ))}
                                                </div>
                                            </Card.Text>
                                            <Badge bg="#000" className="m-1 p-2 d-block w-100 color-identifier border" >{item.identifier}  </Badge>
                                        </Card.Body>
                                    </Card>
                                </Col>;
                            })
                        }

                    </Row>
                </div>
            </Container>
        </>
    );
}

export default App;
